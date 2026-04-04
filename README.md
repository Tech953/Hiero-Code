# Hiero-Code

**A symbolic programming language and visual explorer combining Egyptian hieroglyphics, Sumerian base-60, Mayan base-20, Khoisan click phonemes, Yorùbá àṣẹ philosophy, Daoist principles, and Nahua/Mayan philosophy of mind.**

---

## What It Is

Hiero-Code is an interactive research platform and symbolic computation engine. Every rune node is simultaneously a glyph, a number, a philosophical concept, and a live computational unit. The system encodes meaning across nine cosmological traditions and lets users compose, animate, and execute symbolic programs.

---

## Features

| Module | Description |
|---|---|
| **Rune Explorer** | Browse, create, and inspect all 51+ rune nodes — each with ASE Vitality, Maat Balance, Sumerian Resonance, and symbolic procedure code |
| **Graph View** | Interactive force-directed network of all rune relationships and cross-references |
| **Programs** | Compose symbolic programs from rune sequences; execute and trace output |
| **Numerology** | Convert between decimal, Egyptian hieroglyphic, and Sumerian base-60 numeric systems |
| **Glyphs** | Browse the full Unicode Egyptian and Sumerian glyph sets with phonetic mappings |
| **Framework** | Full technical specification of the Hiero-Code language and type system |
| **Emotion Nodes** | Affective-state runes grounded in cross-cultural emotional ontologies |
| **Cosmologies** | Nine philosophical traditions that form the language's conceptual substrate |
| **Pyri Network** | Live animated Pyri interpreter — channel-based micro-state propagation (S₀–S₈) |

---

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **Routing**: Wouter
- **State**: TanStack Query
- **Backend**: Express + Fastify (Node.js)
- **Database**: PostgreSQL via Drizzle ORM
- **Workspace**: pnpm monorepo

---

## Project Structure

```
artifacts/
  api-server/          Express API — runes, programs, numerology, seed endpoints
  hiero-code/          React frontend — all pages, components, UI
    src/
      pages/           dashboard, runes, graph, programs, numerology, glyphs,
                       framework, emotions, cosmology, pyri-network
      components/      layout, ui/
```

---

## Quick Start

```bash
pnpm install
# Start API server
pnpm --filter @workspace/api-server run dev
# Start frontend
pnpm --filter @workspace/hiero-code run dev
```

The API server runs on port 8080. The frontend reads `VITE_API_URL` to connect.

---

## Seed Data

```bash
# Seed base runes
POST /api/seed/base

# Seed 20 cosmological runes (IDs 32–51)
POST /api/seed/cosmology
```

---

## The Nine Traditions

1. **Yorùbá / Àṣẹ** — vital force underlying all existence (ASE Vitality property)
2. **Egyptian / Maat** — 42 Laws of Maat, structural balance (Maat Balance property)
3. **Book of the Dead** — procedural chapters as symbolic programs
4. **Nahua / Teotl** — animating force; Tonalli + Teyolia soul components
5. **Daoist** — Wu-Wei, yin-yang, flow and non-forcing
6. **Trees of Life** — Kabbalistic, Yggdrasil, Ashvattha, Ceiba cross-tradition comparison
7. **Spider Woman / Ojibwe** — Asibikaashi dreamcatcher weaving, 12-culture cross-reference
8. **WEAVE > WALL** — Nagual + Spider Woman + S-tier evolution as bio-defense filtering mesh
9. **Void Network / Pyri** — PyriNode channel architecture, deterministic micro-state transitions

---

## Pyri System

The Pyri Network replaces randomness with deterministic **channel-based propagation** (channels α–ζ). Each node evolves through nine micro-states (S₀–S₈). Symbol layers are hot-swappable: Greek, Sumerian (𒀀), Egyptian (𓀀), or Emoji (🌑) — all represent the same deterministic logic.

---

## License

Research prototype. All rights reserved.
