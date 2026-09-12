import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://api.studio.thegraph.com/query/1723243/erc-8004-arc-testnet/version/latest",
  documents: ["src/lib/subgraphs/erc-8004.graphql"],
  ignoreNoDocuments: true,
  generates: {
    ".generated/erc-8004/index.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-graphql-request"],
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
