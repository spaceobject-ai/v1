import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { ApiClient } from "../lib/api";
import { jsonToolResult } from "../lib/mcp";

export const registerListAgentFeedbacksTool = (client: ApiClient) => (server: McpServer) => {
  server.registerTool(
    "list_agent_feedbacks",
    {
      title: "List agent feedbacks",
      description:
        "List feedback left for an agent. Each entry has the client address, score, tags, feedback URI, and creation details. Paginate with limit and skip. Errors if the agent does not exist.",
      inputSchema: {
        agentId: z.string().describe("Agent id"),
        limit: z.number().int().positive().max(1000).default(50).describe("Maximum results"),
        skip: z.number().int().nonnegative().max(5000).default(0).describe("Results to skip"),
      },
    },
    async (input) => {
      const response = await client.v1.agents[":agentId"].feedbacks.$get({
        param: { agentId: input.agentId },
        query: {
          limit: String(input.limit),
          skip: String(input.skip),
        },
      });

      return jsonToolResult(response);
    },
  );
};
