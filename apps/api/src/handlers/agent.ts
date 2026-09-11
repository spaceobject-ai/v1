import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { Env } from "../env";
import { problemDetailsResponse } from "hono-problem-details/openapi";

export const getAgentParamsSchema = z.object({
  id: z.string(),
});
export const getAgentResponseSchema = z.object({});
export const getAgentRoute = createRoute({
  method: "get",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: getAgentParamsSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Success message",
    },
    404: problemDetailsResponse(404),
  },
});

export const agentHandlers = new OpenAPIHono<Env>().openapi(getAgentRoute, async (c) => {
  return c.json(undefined, 200);
});
