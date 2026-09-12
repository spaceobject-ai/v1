import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema:
    "https://api.studio.thegraph.com/query/1723243/space-object-erc-8183-agentic-commerce/version/latest",
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
