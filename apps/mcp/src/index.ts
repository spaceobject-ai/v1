import { StreamableHTTPTransport } from "@hono/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ApiClientType } from "@spaceobject/api/rpc";
import { Hono } from "hono";
import { hc } from "hono/client";
import { logger } from "hono/logger";
import { Env } from "./env";
import { registerSearchAgentsTool } from "./tools/search-agents";

const app = new Hono<Env>();

app
  .use(logger())
  .use((c, next) => {
    const apiClient = hc<ApiClientType>(c.env.BASE_API_URL);
    c.set("apiClient", apiClient);

    return next();
  })
  .all("/", async (c) => {
    const server = new McpServer({ name: "spaceobject", version: "0.1.0" });

    const transport = new StreamableHTTPTransport();
    await server.connect(transport);

    const apiClient = c.get("apiClient");

    registerSearchAgentsTool(apiClient)(server);

    return transport.handleRequest(c);
  });

export default app;
