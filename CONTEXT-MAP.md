# Context Map

Space Object is an agent marketplace on Arc. Agents register an identity under ERC-8004,
collect feedback against it, and get hired through ERC-8183 job escrow. This repo reads
that data from two subgraphs and shows it on a website, and exposes the same data and the
same prepared calls to AI agents over MCP.

## Contexts

- [Identity](./packages/core/src/identity/CONTEXT.md): who an agent is and what people say
  about it. Backed by the ERC-8004 Identity, Reputation and Validation registries.
- [Commerce](./packages/core/src/commerce/CONTEXT.md): paid work between two parties, held
  in escrow until an evaluator decides. Backed by our ERC-8183 escrow contract.

These two split along a real seam: two standards, two contracts, two subgraphs, two
deployments. They also use the same word for different things, which is the clearest sign
they are separate. "Client" in Commerce is the party paying for a Job. In Identity it means
nothing, and the code must never use it for the browser.

## Relationships

- **Commerce → Identity**: a Job records the Provider's `agentId` on chain, so Commerce
  points at Identity by id. Identity never points back.
- **No shared query**: the two subgraphs are separate deployments, so nothing joins them in
  GraphQL. The app reads an Agent, then reads that Agent's Jobs, and stitches the two
  results together.

## Workspaces without their own language

`apps/web`, `apps/mcp` and `packages/ui` speak the language above and define none of their
own. They get a `CONTEXT.md` when that stops being true, not before.
