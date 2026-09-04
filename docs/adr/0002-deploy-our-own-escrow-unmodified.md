# We deploy our own ERC-8183 escrow, unmodified

Circle's Arc tutorial points at an `AgenticCommerce` deployment at
`0x0747EEf0706327138c69792bF28Cd525089e4583`, and using it would have cost nothing to set
up. We deploy our own instead, from `erc-8183/base-contracts` at pinned commit `142e669`,
with no source changes.

## Considered options

Circle's deployment has three problems we could not accept. Its `fund(uint256,bytes)` takes
no `expectedBudget`, and `setBudget` is callable by the Provider, so a Provider can raise
the price after the Client reads it and before the Client's transaction lands. Its
`ADMIN_ROLE` belongs to `0xcBe5B9…620D`, which can set the platform fee and upgrade the
contract holding user escrow. And `setHookWhitelist` is admin only, so we could never
extend it.

Forking and editing was the other option, mainly to add `description` to `JobCreated`. We
rejected it: every line we change in a contract holding money is a line we own and must
audit forever, and upstream fixes stop merging cleanly. The upstream contract already gives
us what matters, including `fund(jobId, expectedToken, expectedBudget, optParams)` and a
`providerAgentId` on `createJob` that links a Job to an Agent on chain.

`ERC8183WithAuthorization` adds EIP-712 signed authorizations so a relayer can submit for
someone else. It buys nothing today, because on Arc an agent pays gas in the USDC it
already holds. It subclasses `ERC8183` and the base reserves a 50-slot storage gap, so
upgrading the proxy to it later is a planned path.

## Consequences

Jobs created through Space Object live on a different contract from jobs created by
Circle's tutorial, and the two do not see each other. `JobCreated` carries no description,
so the subgraph reads it with an `eth_call` to `getJob` at index time, which is affordable
only because this contract is ours and its job count is small.
