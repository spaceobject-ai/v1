import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { ApiClient } from "../lib/api";
import { jsonToolResult } from "../lib/mcp";

export const registerListAgentServicesTool = (client: ApiClient) => (server: McpServer) => {
  server.registerTool(
    "list_agent_services",
    {
      title: "List agent services",
      description:
        "List the services an agent registered, with each service's name, kind, endpoint, version, features, and attributes. Errors if the agent does not exist.",
      inputSchema: {
        agentId: z.string().describe("Agent id"),
      },
    },
    async (input) => {
      const response = await client.v1.agents[":agentId"].services.$get({
        param: { agentId: input.agentId },
      });

      return jsonToolResult(response);
    },
  );
};
