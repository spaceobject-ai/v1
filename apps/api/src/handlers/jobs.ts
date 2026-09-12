import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import { Job_Filter, JobStatus, JobSummaryFragment } from "../../.generated/erc-8183";
import { Env } from "../env";
import { parseTimestamp } from "../utils/timestamp";

// The escrow only flips a job to EXPIRED when someone calls claimRefund, so a
// job past its deadline can still read OPEN, FUNDED, or SUBMITTED on-chain.
// Derive the effective status from expiresAt instead of trusting the stored
// one. SUBMITTED jobs get the contract's evaluation grace period, during which
// the evaluator can still complete them.
const EVALUATION_GRACE_PERIOD_SECONDS = 3600;

const effectiveStatus = (job: JobSummaryFragment, nowSeconds: number): JobStatus => {
  const expiresAt = Number(job.expiresAt);
  if ((job.status === "OPEN" || job.status === "FUNDED") && expiresAt <= nowSeconds)
    return "EXPIRED";
  if (job.status === "SUBMITTED" && expiresAt + EVALUATION_GRACE_PERIOD_SECONDS <= nowSeconds)
    return "EXPIRED";
  return job.status;
};

// Branches to `or` together for a status filter, mirroring effectiveStatus.
const statusFilters = (status: JobStatus, nowSeconds: number): Job_Filter[] => {
  const now = String(nowSeconds);
  const graceCutoff = String(nowSeconds - EVALUATION_GRACE_PERIOD_SECONDS);
  if (status === "EXPIRED")
    return [
      { status: "EXPIRED" },
      { status_in: ["OPEN", "FUNDED"], expiresAt_lte: now },
      { status: "SUBMITTED", expiresAt_lte: graceCutoff },
    ];
  if (status === "OPEN" || status === "FUNDED") return [{ status, expiresAt_gt: now }];
  if (status === "SUBMITTED") return [{ status, expiresAt_gt: graceCutoff }];
  return [{ status }];
};

const jobActivitySchema = z.object({
  kind: z.string(),
  address: z.string().nullable(),
  amount: z.string().nullable(),
  timestamp: z.number(),
  txHash: z.string(),
});

const jobSummarySchema = z.object({
  id: z.string(),
  status: z.string(),
  client: z.string(),
  provider: z.string().nullable(),
  evaluator: z.string(),
  agentId: z.string().nullable(),
  description: z.string(),
  budget: z
    .object({
      amount: z.string(),
      token: z.string(),
    })
    .nullable(),
  expiresAt: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
  activities: z.array(jobActivitySchema),
});

const toJobSummary = (job: JobSummaryFragment, nowSeconds: number) => ({
  id: job.jobId,
  status: effectiveStatus(job, nowSeconds),
  client: job.client.address,
  provider: job.provider?.address ?? null,
  evaluator: job.evaluator.address,
  agentId: job.providerAgentId === "0" ? null : job.providerAgentId,
  description: job.description,
  budget: job.paymentToken ? { amount: job.budget, token: job.paymentToken } : null,
  expiresAt: parseTimestamp(job.expiresAt),
  createdAt: parseTimestamp(job.createdAt),
  updatedAt: parseTimestamp(job.updatedAt),
  activities: job.activities.map((activity) => ({
    kind: activity.kind,
    address: activity.actor?.address ?? null,
    amount: activity.amount ?? null,
    timestamp: parseTimestamp(activity.timestamp),
    txHash: activity.txHash,
  })),
});

export const listJobsQuerySchema = z.object({
  client: z.string().optional().openapi({ description: "Job client address" }),
  provider: z.string().optional().openapi({ description: "Job provider address" }),
  status: z
    .enum(["OPEN", "FUNDED", "SUBMITTED", "COMPLETED", "REJECTED", "EXPIRED"])
    .optional()
    .openapi({
      description:
        "Job status. EXPIRED includes jobs past their deadline even if no refund was claimed yet",
    }),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(1000)
    .default(20)
    .openapi({ description: "Maximum results per query", example: 20 }),
  skip: z.coerce
    .number()
    .int()
    .nonnegative()
    .max(5000)
    .default(0)
    .openapi({ description: "Number of results to skip" }),
});
export const listJobsOutputSchema = z.array(jobSummarySchema);
export const listJobsRoute = createRoute({
  method: "get",
  path: "/",
  request: {
    query: listJobsQuerySchema,
  },
  responses: {
    200: {
      description: "Jobs found",
      content: {
        "application/json": {
          schema: listJobsOutputSchema,
        },
      },
    },
  },
});

export const jobHandlers = new OpenAPIHono<Env>().openapi(listJobsRoute, async (c) => {
  const query = c.req.valid("query");
  const nowSeconds = Math.floor(Date.now() / 1000);

  const baseFilter = {
    ...(query.client ? { client: query.client.toLowerCase() } : {}),
    ...(query.provider ? { provider: query.provider.toLowerCase() } : {}),
  };

  const { jobs } = await c.var.erc8183.ListJobs({
    first: query.limit,
    skip: query.skip,
    // `or` cannot sit next to sibling fields, so the base filter is repeated
    // inside each branch.
    where: query.status
      ? {
          or: statusFilters(query.status, nowSeconds).map((filter) => ({
            ...baseFilter,
            ...filter,
          })),
        }
      : baseFilter,
  });

  const result = listJobsOutputSchema.safeParse(jobs.map((job) => toJobSummary(job, nowSeconds)));
  if (!result.success) throw new Error(result.error.message);

  return c.json(result.data);
});
