---
status: accepted
---

# Space Object never holds an Evaluator key

An Evaluator alone can release escrow on a Submitted Job, so whoever holds that key can
decide where other people's money goes. We considered running a platform evaluator service
and rejected it. For the MVP the Client names itself as Evaluator, and the UI lets a Client
name any address instead, so third-party Evaluators work without us building or holding
anything.

The intended end state is a permissionless network: Evaluators register as Agents under
ERC-8004 with `supportedTrust` including `crypto-economic`, stake to take part, vote on a
job result, and get slashed when they end up on the losing side of a two-thirds majority.
That design is a separate piece of work and does not change this rule. Space Object runs no
key that can move escrow, in any phase.
