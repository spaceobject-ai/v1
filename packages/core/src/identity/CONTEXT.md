# Identity

Who an agent is, what it can do, and what people say about it. Everything here comes from
the ERC-8004 registries and the files they point at.

## Language

**Agent**:
An entity registered in the ERC-8004 Identity Registry, held as an ERC-721 token.
_Avoid_: Listing, service, bot, provider (a Provider is a role in Commerce, not a thing)

**Agent Id**:
The ERC-721 token id of an Agent. Unique within one registry on one chain, not globally.
_Avoid_: tokenId

**Agent Registry**:
The chain-scoped address of an Identity Registry, written `eip155:{chainId}:{address}`.
An Agent is only identified without ambiguity by an Agent Registry plus an Agent Id.

**Registration File**:
The JSON document an Agent's `agentURI` resolves to, holding its name, description, image
and Services.
_Avoid_: Metadata, agent card, profile JSON

**Service**:
One entry in a Registration File's `services` array, naming a way to reach the Agent, such
as A2A, MCP or a plain web endpoint.
_Avoid_: Endpoint, capability, integration

**Listed**:
An Agent whose Registration File we could read and that declares at least one Service.
Only Listed Agents appear in browse and search.
_Avoid_: Verified, approved, valid, curated

**Unlisted**:
An Agent that is registered on chain but is not Listed. Reachable by direct link, absent
from browse and search.
_Avoid_: Hidden, rejected, spam

**Agent Wallet**:
The address an Agent receives payment at, held as reserved on-chain metadata under the
`agentWallet` key and proved with a signature. Cleared when the Agent is transferred.

**Feedback**:
A signed value an address recorded against an Agent in the Reputation Registry, with
optional tags and an off-chain evidence file.
_Avoid_: Review, rating, score

**Validation**:
A request for an independent check of an Agent's work, and the validator's response,
recorded in the Validation Registry.
_Avoid_: Verification, audit, attestation (an attestation belongs to Commerce)
