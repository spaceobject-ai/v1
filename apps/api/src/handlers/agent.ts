import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { problemDetailsResponse } from "hono-problem-details/openapi";
import { problemDetails } from "hono-problem-details";

import { Env } from "../env";
import { agentEntityId } from "../utils/agent";
import { CHAIN_IDS } from "../config/chain";
import { REGISTRIES } from "../config/agent-registry";

export const searchAgentsQuerySchema = z.object({
  q: z.string().optional().openapi({ description: "Search query" }),
  owner: z.string().optional().openapi({ description: "Agent owner address" }),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .default(50)
    .openapi({ description: "Maximum results per query", example: 50 }),
  lastAgentId: z.string().optional().openapi({ description: "Cursor from the previous page" }),
});
export const searchAgentsOutputSchema = z.object({});
export const searchAgentsRoute = createRoute({
  method: "get",
  path: "/",
  request: {
    query: searchAgentsQuerySchema,
  },
  responses: {
    200: {
      description: "Agents found",
      content: {
        "application/json": {
          schema: searchAgentsOutputSchema,
        },
      },
    },
  },
});

export const getAgentParamsSchema = z.object({
  agentId: z.string(),
});
export const getAgentOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()),
  feedbackCount: z.number(),
  owner: z.string(),
  createdAt: z.number(),
  createdAtTransaction: z.string(),
});
export const getAgentRoute = createRoute({
  method: "get",
  path: "/{agentId}",
  request: {
    params: getAgentParamsSchema,
  },
  responses: {
    200: {
      description: "Agent found",
      content: {
        "application/json": {
          schema: getAgentOutputSchema,
        },
      },
    },
    404: problemDetailsResponse(404),
  },
});

export const listAgentServicesParamsSchema = z.object({
  agentId: z.string(),
});
export const listAgentServicesOutputSchema = z.object({});
export const listAgentServicesRoute = createRoute({
  method: "get",
  path: "/{agentId}/services",
  request: {
    params: listAgentServicesParamsSchema,
  },
  responses: {
    200: {
      description: "Agent services found",
      content: {
        "application/json": {
          schema: listAgentServicesOutputSchema,
        },
      },
    },
    404: problemDetailsResponse(404),
  },
});

export const listAgentFeedbacksParamsSchema = z.object({
  agentId: z.string(),
});
export const listAgentFeedbacksOutputSchema = z.object({});
export const listAgentFeedbacksRoute = createRoute({
  method: "get",
  path: "/{agentId}/feedbacks",
  request: {
    params: listAgentFeedbacksParamsSchema,
  },
  responses: {
    200: {
      description: "Agent feedback found",
      content: {
        "application/json": {
          schema: listAgentFeedbacksOutputSchema,
        },
      },
    },
    404: problemDetailsResponse(404),
  },
});

export const agentHandlers = new OpenAPIHono<Env>()
  .openapi(searchAgentsRoute, () => {
    throw new Error("Not implemented");
  })
  .openapi(getAgentRoute, async (c) => {
    const agentId = c.req.param("agentId");

    const id = agentEntityId(
      CHAIN_IDS.arcTestnet,
      REGISTRIES[CHAIN_IDS.arcTestnet].identityRegistry,
      agentId,
    );

    const { agent } = await c.var.erc8004.GetAgent({ id });

    if (!agent)
      throw problemDetails({
        status: 404,
        title: "Not found",
        detail: `Agent with id ${agentId} not found`,
        type: "Agent",
      });

    const result = getAgentOutputSchema.safeParse({
      id: agent.id,
      name: agent.profile?.name ?? "",
      description: agent.profile?.description ?? "",
      image: agent.profile?.image ?? null,
      metadata: Object.fromEntries(agent.metadata.map(({ key, value }) => [key, value])),
      feedbackCount: Number(agent.feedbackCount),
      owner: agent.owner?.address ?? "0x",
      createdAt: Number(agent.createdAt),
      createdAtTransaction: agent.createdAtTransaction,
    });
    if (!result.success) throw new Error(result.error.message);

    return c.json(result.data);
  })
  .openapi(listAgentServicesRoute, () => {
    throw new Error("Not implemented");
  })
  .openapi(listAgentFeedbacksRoute, () => {
    throw new Error("Not implemented");
  });
