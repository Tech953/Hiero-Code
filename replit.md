# Hiero-Code Workspace

## Overview

A symbolic computing language and visual explorer inspired by ancient Egyptian hieroglyphics, Sumerian cuneiform numerology, and the Hiero-Code multi-scale glyph node architecture. Rune nodes encode machine learning computations using ASE vitality (influence), Maat balance (equilibrium), and Sumerian sexagesimal resonance scaling.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS (artifacts/hiero-code)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Architecture

### Frontend Pages
- `/` — Dashboard: system stats, rune distribution by system/scale, ASE/Maat averages, recent activity
- `/runes` — Rune node grid: glyph cards showing symbol, system, scale, ASE/Maat indicators (31 runes across 14 systems)
- `/runes/:id` — Rune detail: procedure code, connections, execute rune, view propagation trace
- `/runes/new` — Create new rune node with glyph picker (14 system options, 7 scale options)
- `/graph` — Interactive canvas visualization of node graph and connections
- `/programs` — Hiero-Code programs list (symbolic procedure sequences)
- `/programs/:id` — Program editor with execution trace viewer
- `/numerology` — 5-tab reference: Egyptian (Base-10), Sumerian (Base-60), Mayan (Base-20), Khoisan Click Phonemes, Language Alignment + number converter
- `/maya-glyphs` — Maya Hieroglyphs catalog: 322 entries (210 Logogram, 97 Syllabogram, 7 Compound Sign, 7 Introduction, 1 Undeciphered) from Tokovinine's visual catalog; filterable/searchable/paginated
- `/glyphs` — Glyph library: 54 glyphs across Egyptian, Sumerian, Mayan, Khoisan, and Pyri systems
- `/framework` — Hieroglyphic Code Framework reference: two annotated images + Pyri Set, Three Language Systems, adaptation tiers, information density table
- `/emotions` — Pyri Emotion Nodes: 768 QUERTY emoji micro-expressions with Valence × Arousal × Gesture vectors, Khoisan click phoneme cards, core emotion vectors, full filterable/paginated matrix

### Core Concepts
- **RuneNode**: A symbolic ML data node. Each rune has a glyph (pictographic identity), procedure code (symbolic algorithm), ASE vitality (influence strength), Maat balance (stability), and Sumerian resonance (base-60 scaling weight).
- **Procedure Codes**: `DOUBLE`, `HALVE`, `UNIT_FRACTION(n)`, `SCALE_60`, `ASE_AMPLIFY`, `MAAT_BALANCE`
- **Egyptian system**: Base-10 additive hieroglyphic notation
- **Sumerian system**: Base-60 (sexagesimal) positional notation — sacred numbers 1·6·12·60
- **Mayan system**: Base-20 (vigesimal) vertical glyph stacking — dots, bars, shell zero
- **Khoisan system**: Multi-channel click phonemes (|, ‡, !, ||) — 4–6 parallel data channels per sound
- **Pyri system**: QUERTY-derived emotion macro-nodes — valence × arousal × gesture vectors

### S+ Rune Categories (from Rune_Brainstorm.csv)
- Celestial/Outer Space: Supernova-Burst, Pulsar-Signal, Nebula-Seed, Black-Hole-Void
- Temporal/Cyclical: Solstice-Gate, Lunar-Tide
- Elemental/Material: Plasma-Force, Crystal-Form
- Biological/Ecological: Neural-Network, Evolution-Eye
- Geological/Planetary: Tectonic-Shift
- Atmospheric/Weather: Aurora-Wave, Cyclone-Spiral
- Energy/Field Phenomena: EM-Resonance
- Cognitive/Abstract: Dream-Imprint, Archetype-Node
- Khoisan Click: Dental-Click (C), Lateral-Click (X)
- Pyri Emotion: Frustration (>.<), Awe (*_*), Contentment (^.^)
- Dimensional/Multi-Realm: Wormhole-Gate, Temporal-Overlap

### Numerology Systems
- Egyptian: Powers of 10 (𓏤=1, 𓎆=10, 𓍢=100, 𓆼=1000...) with unit fractions (Rhind Papyrus style)
- Sumerian: Base-60 (𒁹=1, 𒐙=10, 𒐚=60, 𒐞=3600...) with regular factor fractions

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Database Tables
- `runes` — rune node definitions with procedure code, ASE, Maat, Sumerian resonance
- `programs` — Hiero-Code symbolic programs composed of ordered rune sequences
- `maya_glyph_entries` — Maya hieroglyphs catalog entries (title, category, summary, body)

## Artifact Routing
- `/` → hiero-code frontend (React + Vite)
- `/api` → api-server (Express)
