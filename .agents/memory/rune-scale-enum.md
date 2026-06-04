---
name: Rune scale enum drift
description: The rune.scale field is free-text in the DB but enum-constrained in the API contract
---

The `runes.scale` column is free-text (varchar), and seeded runes (cosmology, Inupiat, Aztec)
use richer values than the original contract: `void, s-tier, field, geological` on top of
`macro, micro, particle, temporal`. The create-rune form (`rune-new.tsx`) also offers these.

**Why it matters:** GET handlers return raw DB rows (no output Zod), so non-enum scales display
fine — but `POST /runes` runs `CreateRuneBody.parse()`, so any scale missing from the OpenAPI
enum is rejected at create time. Seeding bypasses this; the API and form do not.

**How to apply:** keep the `scale` enum in `lib/api-spec/openapi.yaml` (two occurrences: create
body + rune model) in sync with every value the seed data and the create form use, then run
`pnpm --filter @workspace/api-spec run codegen`. The same drift risk exists for the rune `system`
field vs the form's category options — check both if adding new rune categories.
