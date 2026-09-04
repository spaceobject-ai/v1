# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT-MAP.md`** at the repo root: it points at one `CONTEXT.md` per context. Read each one relevant to the topic.
- **`docs/adr/`**: read ADRs that touch the area you're about to work in.
- Check each relevant workspace's `docs/adr/` directory for context-scoped decisions.

If any of these files don't exist, **proceed silently**. Don't flag their absence or suggest creating them upfront. The `/domain-modeling` skill creates them lazily when terms or decisions actually get resolved.

## File structure

This is a multi-context repository:

```text
/
├── CONTEXT-MAP.md
├── docs/adr/                         ← system-wide decisions
├── apps/
│   └── website/
│       ├── CONTEXT.md
│       └── docs/adr/                 ← website-specific decisions
└── packages/
    └── utils/
        ├── CONTEXT.md
        └── docs/adr/                 ← utilities-specific decisions
```

New independently modeled workspaces may add their own `CONTEXT.md` and `docs/adr/` directory and should be registered in the root `CONTEXT-MAP.md`.

## Use the glossary's vocabulary

When output names a domain concept—in an issue title, refactor proposal, hypothesis, or test name—use the term defined in the relevant `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If a required concept isn't in the glossary, reconsider whether the language belongs to the project or note the gap for `/domain-modeling`.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders), but worth reopening because…_
