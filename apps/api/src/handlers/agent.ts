import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { Env } from "../env";
import { problemDetailsResponse } from "hono-problem-details/openapi";

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
export const getAgentOutputSchema = z.object({});
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
  .openapi(getAgentRoute, () => {
    throw new Error("Not implemented");
  })
  .openapi(listAgentServicesRoute, () => {
    throw new Error("Not implemented");
  })
  .openapi(listAgentFeedbacksRoute, () => {
    throw new Error("Not implemented");
  });
