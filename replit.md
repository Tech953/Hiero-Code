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
- `/runes` — Rune node grid: glyph cards showing symbol, system, scale, ASE/Maat indicators
- `/runes/:id` — Rune detail: procedure code, connections, execute rune, view propagation trace
- `/runes/new` — Create new rune node with glyph picker
- `/graph` — Interactive canvas visualization of node graph and connections
- `/programs` — Hiero-Code programs list (symbolic procedure sequences)
- `/programs/:id` — Program editor with execution trace viewer
- `/numerology` — Egyptian and Sumerian numeral reference tables + number converter
- `/glyphs` — Glyph library browser (Egyptian, Sumerian, Mayan systems)

### Core Concepts
- **RuneNode**: A symbolic ML data node. Each rune has a glyph (pictographic identity), procedure code (symbolic algorithm), ASE vitality (influence strength), Maat balance (stability), and Sumerian resonance (base-60 scaling weight).
- **Procedure Codes**: `DOUBLE`, `HALVE`, `UNIT_FRACTION(n)`, `SCALE_60`, `ASE_AMPLIFY`, `MAAT_BALANCE`
- **Egyptian system**: Base-10 additive hieroglyphic notation
- **Sumerian system**: Base-60 (sexagesimal) positional notation
- **Mayan system**: Planned future integration (base-20 vigesimal)

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

## Artifact Routing
- `/` → hiero-code frontend (React + Vite)
- `/api` → api-server (Express)
