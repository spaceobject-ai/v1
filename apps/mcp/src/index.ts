import { StreamableHTTPTransport } from "@hono/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { productDescription } from "@spaceobject/core";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { Env } from "./env";

const app = new Hono<Env>();

app.use(logger()).all("/", async (c) => {
  const server = new McpServer(
    { name: "spaceobject", version: "0.0.0" },
    { instructions: productDescription },
  );

  const transport = new StreamableHTTPTransport();
  await server.connect(transport);

  return transport.handleRequest(c);
});

export default app;
