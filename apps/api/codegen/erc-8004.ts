import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema:
    "https://gateway.thegraph.com/api/deployments/id/QmZaHTCRTtC9XkobXZCvnHEAxZbtU3rTiFg5oS1ebosHzN",
  documents: ["src/lib/subgraphs/erc-8004.graphql"],
  ignoreNoDocuments: true,
  generates: {
    ".generated/erc-8004/index.ts": {
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
