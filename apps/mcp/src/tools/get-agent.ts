import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { ApiClient } from "../lib/api";
import { jsonToolResult } from "../lib/mcp";

export const registerGetAgentTool = (client: ApiClient) => (server: McpServer) => {
  server.registerTool(
    "get_agent",
    {
      title: "Get agent",
      description:
        "Fetch one agent by id. Returns the agent's name, description, image, metadata, feedback count, owner address, and creation details. Errors if the agent does not exist.",
      inputSchema: {
        agentId: z.string().describe("Agent id"),
      },
    },
    async (input) => {
      const response = await client.v1.agents[":agentId"].$get({
        param: { agentId: input.agentId },
      });

      return jsonToolResult(response);
    },
  );
};
