---
status: accepted
---

# The escrow admin is an EOA on testnet and a Safe before mainnet

`initialize(treasury_, admin_)` grants one address both `DEFAULT_ADMIN_ROLE` and
`ADMIN_ROLE`, which together can upgrade the escrow, pause it, call `emergencyWithdraw`,
set both fees, and control the token and hook allowlists. On Arc testnet that address is a
dedicated deployer EOA, because the money is faucet USDC and a multisig would slow us down
for no gain. No real money moves through this contract until the admin is a Safe multisig,
which is deployable on Arc: the 1.4.1 singleton and proxy factory both have code there.

The treasury is a separate address from the deployer even on testnet, so the split is real
from the start rather than a migration later. At mainnet the admin becomes a Safe and the
treasury stays a plain address that the Safe controls, because a treasury needing three
signatures to move a fee payment is a treasury nobody ever empties.

`platformFeeBP` and `evaluatorFeeBP` both start at 0. Charging a fee on play money teaches
us nothing and a non-zero fee changes every number in the UI. Note that `evaluatorFeeBP` is
not only a revenue dial: it is how the future staked Evaluator network gets paid.
