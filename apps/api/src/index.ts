import { GraphQLClient } from "graphql-request";
import { OpenAPIHono as Hono } from "@hono/zod-openapi";
import { problemDetailsHandler } from "hono-problem-details";
import { logger } from "hono/logger";

import { getSdk } from "../.generated/erc-8004/sdk";
import { agentHandlers } from "./handlers/agent";
import { Env } from "./env";

const app = new Hono<Env>()
  .use(logger())
  .onError(
    problemDetailsHandler({
      autoInstance: true,
    }),
  )
  .basePath("/v1")
  .use(async (c, next) => {
    const erc8004Client = new GraphQLClient(c.env.ERC_8004_SUBGRAPH_URL, {
      fetch,
    });

    const erc8004 = getSdk(erc8004Client);
    c.set("erc8004", erc8004);

    return next();
  })
  .route("/agents", agentHandlers);

export default app;
