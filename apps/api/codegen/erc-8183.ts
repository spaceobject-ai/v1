import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema:
    "https://gateway.thegraph.com/api/deployments/id/QmNzCzcMXZL7BDPTGFCpzJPomsq1gMTw3D8GU1heduCKxU",
  documents: ["src/lib/subgraphs/erc-8183.graphql"],
  ignoreNoDocuments: true,
  generates: {
    ".generated/erc-8183/index.ts": {
      plugins: ["typescript-operations", "typescript-graphql-request"],
      config: {
        scalars: {
          BigInt: "string",
          Bytes: "string",
          Timestamp: "string",
        },
      },
    },
  },
};

export default config;
