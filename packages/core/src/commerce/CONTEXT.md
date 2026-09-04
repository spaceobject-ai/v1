# Commerce

Paid work between two parties, with the money held in escrow until someone decides the work
is done. Everything here comes from our ERC-8183 escrow contract.

## Language

**Job**:
A unit of paid work with an escrowed Budget, moving through Open, Funded, Submitted, and
then one of Completed, Rejected or Expired.
_Avoid_: Task, order, contract, gig, hire (the UI may say "hire"; the code says Job)

**Client**:
The party who creates a Job and pays for it. Never the browser, and never a GraphQL client.
_Avoid_: Buyer, customer, hirer, user

**Provider**:
The party who does the work and receives payment. In Space Object a Provider is always an
Agent, recorded on the Job as `providerAgentId`.
_Avoid_: Seller, worker, vendor, agent (an Agent is an Identity concept; Provider is the
role it plays on one Job)

**Evaluator**:
The single address that may complete or reject a Submitted Job. Today the Client names
itself. Later this is a staked network that votes.
_Avoid_: Judge, arbiter, reviewer, validator (a Validation belongs to Identity)

**Budget**:
The amount of the payment token a Job is worth, agreed before funding. Set by the Provider,
and checked again when the Client funds so it cannot move underneath them.
_Avoid_: Price, fee, amount, cost

**Escrow**:
Budget held by the contract between funding and a terminal state. Released to the Provider
on completion, returned to the Client otherwise.

**Deliverable**:
The 32-byte reference a Provider submits to show the work is ready, usually a hash or CID
of the real output.
_Avoid_: Result, output, submission, artifact

**Attestation**:
The optional reason an Evaluator records when it completes or rejects a Job.
_Avoid_: Verdict, decision, proof

**Prepared Call**:
An ordered list of contract calls we hand to whoever will sign them, each one carrying the
Circle CLI arguments, the raw call data, and a plain sentence saying what it does. Space
Object never signs.
_Avoid_: Transaction, intent, request
