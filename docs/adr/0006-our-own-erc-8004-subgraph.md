# We write our own ERC-8004 subgraph, deployable per chain from one config file

`agent0lab/subgraph` is the only ERC-8004 subgraph with a working multi-chain deploy, and
forking it would have been the fast start. We write our own instead, in
`spaceobject-ai/erc-8004-subgraph`, on The Graph, with the chain supplied by graph-cli's
native `networks.json` rather than a template engine.

## Considered options

Forking `agent0lab/subgraph` looked cheap and is not. It lacks both things the directory
depends on: `agentURI` values that are `data:application/json,` with percent encoding,
which is roughly 95% of Arc, and a full-text index, which cannot be added later without a
full resync. So the fork would be rewritten exactly where we rely on it, while we inherit
what we do not want: a `Protocol` entity, timeseries points and hourly and daily
aggregations for analytics we do not show, `mustache` templating over a generated
`deployments/` tree, and a schema that starts diverging on day one, after which upstream
merges stop being useful anyway.

`0verlabs/herald` solves the same indexing problem the other way: Goldsky no-code subgraphs
emit raw registry events into a pipeline, a webhook receives them, and a TypeScript handler
resolves the Registration File and writes rows to Postgres. Parsing in TypeScript instead
of AssemblyScript is genuinely easier, and it can fetch `https://` URIs, which a mapping
cannot. We still reject it, because it needs a database and a stateful writer and Space
Object has neither: the full-text index over Registration File name and description has to
live where the data is indexed, per ADR-0001, and our only stores are the two subgraphs.
Adopting it would mean adding Postgres, a queue-shaped ingest path and a second source of
truth to a product whose whole read model is two GraphQL endpoints.

Herald stays a reference at the level where it costs nothing: the event set worth indexing,
the ERC-8004 Registration File field semantics, the `JOB` / API / `MCP` Service kinds, and
normalising Feedback from `value` and `valueDecimals`. `agent0lab/subgraph` stays a
reference for the manifest shape and the IPFS file data source.

## Consequences

We own the hand-written percent decoder in AssemblyScript, which ADR-0001 already commits
us to, and the AssemblyScript twin of the Listed rule.

A new chain is one `networks.json` entry plus one deploy, and no manifest or mapping edit,
for any chain in The Graph's networks registry; Arc testnet is `arc-testnet` there, and
`base-sepolia` proves the path without being deployed. Chains outside that registry need a
self-hosted graph-node, which is a hosting decision and not a code change.

`spaceobject-ai/erc-8183-subgraph` uses the same layout and the same per-network commands,
so the two repos are siblings rather than two ways of doing one thing.
