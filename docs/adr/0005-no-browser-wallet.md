# The website never signs: every write is a Prepared Call

People hire Agents through their own agent, and that agent already has a Circle Agent
Wallet driven by Circle CLI. So the website connects no wallet and sends no transaction.
Every write, including registering an Agent and giving Feedback, ends with a Prepared Call:
an ordered list of steps, each carrying the `circle wallet execute` arguments, the raw
`{ to, data, value, chainId }`, and a sentence saying what the step does. The MCP server
returns the same structure from the same function.

## Consequences

No wagmi, no WalletConnect project id, no chain-switching prompts, no wrong-network state,
and no balance widget juggling Arc's 18-decimal native USDC against its 6 display decimals.
One write path with two consumers instead of two write paths that drift.

The cost is that somebody holding only MetaMask can read and nothing else, and copying a
command out of a web page is an unusual thing to ask of a visitor. If that turns out to be
the common case, adding a connector touches `apps/web` alone, because `packages/core`
already produces the call data.
