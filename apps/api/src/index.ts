import { OpenAPIHono as Hono } from "@hono/zod-openapi";
import { Env } from "./env";
import { problemDetailsHandler } from "hono-problem-details";
import { agentHandlers } from "./handlers/agent";

const app = new Hono<Env>()
  .onError(problemDetailsHandler())
  .basePath("/v1")
  .route("/agents", agentHandlers);

export default app;
