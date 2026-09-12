import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { ApiClient } from "../lib/api";
import { jsonToolResult } from "../lib/mcp";

export const registerListJobsTool = (client: ApiClient) => (server: McpServer) => {
  server.registerTool(
    "list_jobs",
    {
      title: "List jobs",
      description:
        "List jobs, optionally filtered by client address, provider address, or status. Each job includes its status, participants, budget, description, timestamps, and activity history. Paginate with limit and skip.",
      inputSchema: {
        client: z.string().optional().describe("Filter by job client address"),
        provider: z.string().optional().describe("Filter by job provider address"),
        status: z
          .enum(["OPEN", "FUNDED", "SUBMITTED", "COMPLETED", "REJECTED", "EXPIRED"])
          .optional()
          .describe(
            "Filter by job status. EXPIRED includes jobs past their deadline even if no refund was claimed yet",
          ),
        limit: z.number().int().positive().max(1000).default(20).describe("Maximum results"),
        skip: z.number().int().nonnegative().max(5000).default(0).describe("Results to skip"),
      },
    },
    async (input) => {
      const response = await client.v1.jobs.$get({
        query: {
          client: input.client,
          provider: input.provider,
          status: input.status,
          limit: String(input.limit),
          skip: String(input.skip),
        },
      });

      return jsonToolResult(response);
    },
  );
};
