# Only Agents with a readable Registration File and a Service are Listed

Arc testnet has 891,436 registered Agents. In a random sample of 40, 33 parsed and none of
them declared a single Service; they are load-test tokens carrying `name`, `description`,
`image` and an `attributes` array. A directory that shows every Agent shows nothing useful,
so the subgraph indexes all of them without judging, and the app shows only Agents whose
Registration File we could read and that declare at least one Service. Everything else is
Unlisted: reachable by direct link, absent from browse and search, with its page saying
what is missing.

## Consequences

The subgraph can only read `ipfs://` and `data:` URIs, because graph-node mappings cannot
fetch HTTPS. Around 95% of Arc Agents use `data:application/json,` with percent encoding,
which means the mapping needs a percent decoder written by hand in AssemblyScript; handling
only `;base64,` would index almost nothing. An Agent on an `https://` URI can never be
Listed, no matter how correct its file is, and the app fetches that one file in the browser
on the profile page instead.

This makes Space Object's registration wizard the practical way to become Listed, since
nothing on Arc produces a spec-correct file today. That is a feature, not a side effect.
