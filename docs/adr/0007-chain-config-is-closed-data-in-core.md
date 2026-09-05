# The chain set is closed zod data in `packages/core`, and endpoints come from the consumer

Every chain fact lives in `packages/core/src/chain.ts`: the supported chains, a display
name per chain, and the contract addresses on each one. zod schemas come first and every
type is inferred from one, so there is no second declaration of the same shape to keep in
line. The records are parsed when the module loads, which means a bad address or a chain id
that is not in the set throws at import rather than on the page that needed it.

A chain is identified by its CAIP-2 id, `eip155:5042002`, and the set is a `const` array
fed to `z.enum`. So the chain set is closed: a consumer cannot add a chain, and `switch`
over a `Chain` is exhaustive. Adding Arc mainnet is one entry in the array plus one record.
The Identity glossary already writes an Agent Registry as `eip155:{chainId}:{address}`,
which is CAIP-10, so core also owns the two functions that build and parse that id. Nothing
in core reads `5042002` as a number; the parse function returns the namespace and the
reference as strings.

No RPC URL and no explorer URL is in the repo. The consumer holds both.

## Considered options

An open `Record<string, ChainConfig>` that a consumer extends was the other shape. It buys
nothing we need. Space Object supports the chains it ships, per #1, and an open record
costs the exhaustive check and gives a second place where chain data can come from.

A viem-shaped chain object in core was the obvious alternative to holding endpoints in the
consumer. We rejected it because it drags `viem` into a package that two apps and the MCP
server import, and because a chain record with an RPC URL in it is a record that must be
edited to rotate an endpoint. A half-filled viem chain, with the URL left blank, is worse:
it looks like the thing viem wants and is not. So core holds the facts that never change
for a deployment, and the consumer assembles the client.

Addresses are `z.string()` here, not a `0x` regex and not a checksum. Checksumming needs
viem, and a future chain may not be EVM at all, so the strict format check belongs to the
application layer that already knows which chain it is talking to.

## Consequences

Each consumer validates its own RPC URL. `apps/web` reads it from a Worker binding and
`apps/mcp` from its own environment, and neither can borrow a default from core, because
there is none. That is the point: a wrong endpoint fails where it is configured.

The ERC-8183 escrow is not deployed yet, so `contracts.escrow` is optional. Call sites do
not each handle `undefined`: one function returns a contract address for a chain and a
contract name and throws a message naming both when it is unset. #4 fills the address in
and nothing else changes.

ADR-0006 configures the subgraphs per network through graph-cli's `networks.json`. That
stays separate. Two files hold chain data, in two repos, for two tools, and neither
generates the other.
