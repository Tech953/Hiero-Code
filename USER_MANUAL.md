# Hiero-Code — User Manual

**Version 1.0 | Symbolic Compute Platform**

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Dashboard](#2-dashboard)
3. [Rune Explorer](#3-rune-explorer)
4. [Creating a Rune](#4-creating-a-rune)
5. [Graph View](#5-graph-view)
6. [Programs](#6-programs)
7. [Numerology](#7-numerology)
8. [Glyphs](#8-glyphs)
9. [Framework](#9-framework)
10. [Emotion Nodes](#10-emotion-nodes)
11. [Sacred Cosmologies](#11-sacred-cosmologies)
12. [Pyri Network](#12-pyri-network)
13. [Navigation Reference](#13-navigation-reference)
14. [Glossary](#14-glossary)

---

## 1. Getting Started

Hiero-Code runs entirely in your browser. Open the app and you will land on the **Dashboard**. The left sidebar provides navigation to all modules. The app is dark-themed by default; use the **Light Ritual / Dark Ritual** toggle at the bottom of the sidebar to switch.

No login is required.

---

## 2. Dashboard

The Dashboard is your mission control. It shows:

- **System Statistics** — total runes, programs, emotions, and cosmological runes in the database
- **Recent Runes** — the most recently created or modified rune nodes, clickable to their detail pages
- **Cosmological Sources** — an amber card linking to the Cosmologies reference page

Use the dashboard to get a quick read on the state of the knowledge base and jump to recent work.

---

## 3. Rune Explorer

**Path: /runes**

The Rune Explorer lists all rune nodes in the system. Each card shows:

| Field | Description |
|---|---|
| **Name** | The rune's identifier (e.g. `ASE_AMPLIFY`) |
| **Glyph** | Its Egyptian hieroglyph representation |
| **Type** | Cosmological, Emotional, Procedural, etc. |
| **ASE Vitality** | Energy level (0.0–1.0) — Yorùbá àṣẹ life force |
| **Maat Balance** | Structural harmony (0.0–1.0) — 42 Laws of Maat |
| **Sumerian Resonance** | Base-60 harmonic frequency |
| **Symbolic Procedure** | The code-like expression the rune executes |

Click any rune card to open its **detail page**, which includes a cross-reference link back to the Cosmologies source for that tradition.

### Filtering and Search

Use the search bar at the top of the Rune Explorer to filter by name or glyph. Use the type filter to narrow by rune category.

---

## 4. Creating a Rune

**Path: /runes/new**

Click **New Rune** from the Rune Explorer or Dashboard to open the creation form.

**Required fields:**

- **Name** — unique identifier, typically `UPPERCASE_WITH_UNDERSCORES`
- **Glyph** — paste or type the Unicode hieroglyph (U+13000 range for Egyptian, U+12000 for Sumerian)
- **Type** — select from the dropdown (Cosmological, Emotional, Procedural, Structural, etc.)
- **Symbolic Procedure** — the rune's executable expression, e.g. `ASE_AMPLIFY(target, factor=1.5)`

**Optional fields:**

- **ASE Vitality** (0.0–1.0) — defaults to 0.5. Reference the 42 Laws of Maat for balance guidance.
- **Maat Balance** (0.0–1.0) — defaults to 0.5. See the Cosmologies → 42 Laws tab for full context.
- **Sumerian Resonance** — base-60 value representing harmonic frequency
- **Description** — free-form text; supports cross-tradition references

Click **Create Rune** to save. The rune will appear immediately in the Explorer and Graph.

---

## 5. Graph View

**Path: /graph**

The Graph View renders all rune nodes as an interactive force-directed network. Runes with relationships are connected by edges.

**Interactions:**

- **Drag** nodes to reposition them
- **Scroll** to zoom in/out
- **Click** a node to highlight its direct connections
- **Hover** a node to see its name, type, and ASE Vitality

The graph reveals emergent structure — clusters of cosmologically related runes, bridges between traditions, and isolated nodes without connections (candidates for linking).

---

## 6. Programs

**Path: /programs**

Programs are sequences of rune nodes composed into executable symbolic expressions. Think of them as functions or rituals — ordered invocations of rune procedures.

### Creating a Program

1. Click **New Program**
2. Give the program a **name** and optional **description**
3. Use the **rune selector** to add runes in sequence
4. Each rune step can have **arguments** passed to its symbolic procedure
5. Click **Save** to persist the program

### Running a Program

Click **Execute** on any saved program. The system traces through each rune step, showing:

- The symbolic procedure invoked at each step
- The resulting ASE Vitality and Maat Balance state
- The Sumerian Resonance output at each transition

Programs can be shared, forked, and versioned.

---

## 7. Numerology

**Path: /numerology**

The Numerology module is a multi-base number system converter and explorer, combining three ancient numeric traditions:

| System | Base | Example |
|---|---|---|
| **Decimal** | 10 | 60 |
| **Egyptian Hieroglyphic** | 10 (additive) | 𓎆𓏺 |
| **Sumerian Cuneiform** | 60 | 𒁹𒑱 |
| **Mayan** | 20 | ●●●● |

### Converting Numbers

1. Enter a value in the **decimal input**
2. Click **Convert**
3. The module returns the equivalent in Egyptian, Sumerian, and Mayan representations

Note: The converter currently supports decimal → Egyptian and decimal → Sumerian. Mayan conversion is in development.

### Numerological Properties

Below the converter, the module shows the **symbolic weight** of the number — its Maat balance implication based on the 42 Laws, and its ASE resonance factor in the Yorùbá tradition.

---

## 8. Glyphs

**Path: /glyphs**

The Glyphs module is a reference browser for the full Unicode Egyptian and Sumerian symbol sets used in Hiero-Code.

Each glyph entry shows:

- The **Unicode codepoint** (e.g. U+13000)
- The **glyph image** rendered in your browser's font
- The **Gardiner code** (for Egyptian) or **Cuneiform block** (for Sumerian)
- The **phonetic value** or symbolic meaning
- Any **Hiero-Code rune** it has been assigned to

Use the search bar to find glyphs by codepoint, phonetic value, or semantic category.

---

## 9. Framework

**Path: /framework**

The Framework page is the full technical specification of the Hiero-Code language. It covers:

- **Type system** — rune types, properties, and inheritance
- **Execution model** — how symbolic procedures are evaluated
- **Channel architecture** — α–ζ propagation channels and their semantics
- **Hiero-Code grammar** — formal notation for programs
- **Cross-tradition mappings** — how ASE, Maat, Teotl, Dao, and àṣẹ map to computational properties

This page is the authoritative reference for anyone building programs or extending the rune set.

---

## 10. Emotion Nodes

**Path: /emotions**

Emotion Nodes are a special class of rune encoding affective states. They are grounded in cross-cultural emotional ontologies — from Yorùbá affect theory to Japanese *mono no aware* to Nahua *teyolia* (heart-fire).

Each emotion node has:

- A **primary glyph** and **name**
- A **valence** (positive / negative / neutral)
- An **intensity** mapping (ASE Vitality proxy)
- **Cross-cultural equivalents** — the nearest concepts in each of the nine traditions
- A **symbolic procedure** — how this emotion modulates connected rune nodes when invoked

Emotion nodes can be included in programs to model affective transitions, or linked to cosmological runes as modulating forces.

---

## 11. Sacred Cosmologies

**Path: /cosmology**

The Cosmologies page is the philosophical reference center. Nine tabs, each covering one tradition:

### Tab 1 — Àṣẹ Power (Yorùbá)
The foundational concept behind ASE Vitality. Covers the two-realm cosmology (Órun / Ayé), the nature of àṣẹ as performative power, and Henry John Drewal's Sensiotics framework. Includes a full Hiero-Code mapping table.

### Tab 2 — 42 Laws of Maat (Egyptian)
All 42 negative confessions from the Book of the Dead, organized by category. Explains how Maat Balance (0.0–1.0) is computed from the 42 Laws. Includes the Feather of Maat weighing ceremony context.

### Tab 3 — Book of the Dead (Egyptian)
Key chapters (spells) as symbolic programs. Chapter CLXXV (The Day of Not Being), Chapter LXIV (Coming Forth by Day), and the Negative Confession as a validation subroutine. Each chapter is mapped to a Hiero-Code procedure.

### Tab 4 — Teotl / Nahua (Mesoamerican)
The animating force behind all existence in Nahua philosophy. Covers Tonalli (solar head-force), Teyolia (heart fire), Ihiyotl (liver wind), and their parallels to àṣẹ (Yorùbá), Dao (Daoist), and mana (Polynesian). Includes the 20-day Nahua calendar as a base-20 encoding system.

### Tab 5 — The Dao (Daoist)
Wu-Wei, yin-yang, and the Five Elements as computational primitives. Covers the Dao De Jing's relevance to the Pyri stabilization algorithm — the principle that systems self-regulate most effectively when not forced. Includes a Daoist → Hiero-Code operator mapping.

### Tab 6 — Trees of Life
Cross-tradition comparison of sacred tree cosmologies: Kabbalistic Tree of Life (10 Sefirot), Norse Yggdrasil (9 worlds), Hindu Ashvattha (inverted fig tree), and Maya Ceiba. The tree structure maps to the Pyri Network topology — roots = Edge Pyri, trunk = Core Pyri, branches = Flow Pyri.

### Tab 7 — Spider Woman (Ojibwe)
Asibikaashi — the Ojibwe Spider Woman and dreamcatcher origin. Twelve-culture cross-reference grid (Hopi, Navajo, Cherokee, Osage, Mississippian, Maya, Aztec, Andean, Pawnee, Tlingit, Achumawi). Six dreamcatcher weaving patterns with Hiero-Code alignment: the 8-knot web maps to the S₁–S₈ Pyri cycle, S₀ is the center void.

### Tab 8 — WEAVE > WALL
Nagual + Spider Woman + S-tier evolution fused as a bio-defense filtering intelligence. Explains why protection is not a wall but a woven mesh — intelligent permeability over brute force. Includes the Tent System three-layer filter (ground perimeter, rising heat column, internal dreamcatcher web) and the full DETECT → FILTER → ALLOW → TRAP logic table.

### Tab 9 — Void Network
The computational substrate of Hiero-Code. PyriNode architecture, all ten channel signal-flow connections with weights and types, the S₀–S₈ multicultural transition table (Greek/Sumerian/Egyptian/Emoji layers side by side), and a synthesis paragraph connecting all nine traditions to the Void Network model.

---

## 12. Pyri Network

**Path: /pyri-network**

The Pyri Network is a live, interactive visualization of the Hiero-Code interpreter running in your browser.

### The Network

Seven nodes are arranged in a layered topology:

| Node | Type | Color | Role |
|---|---|---|---|
| Core | Core Pyri | Orange | Global state orchestrator — μ0–μ2 micro-states |
| Edge 1, Edge 2 | Edge Pyri | Blue | Input layer — channels α, β, γ |
| Stack 1, Stack 2 | Stack Pyri | Green | Computation layer — σ0–σn with stack memory |
| Flow 1, Flow 2 | Flow Pyri | Purple | Propagation layer — channels δ, ε, ζ |

Ten directed edges connect them. Solid gray edges are forward signals; dashed amber edges are feedback loops.

### Controls

| Button | Action |
|---|---|
| **Run** | Starts continuous propagation (one step every 600ms) |
| **Pause** | Halts propagation |
| **Step** | Advances exactly one tick |
| **Reset** | Returns all nodes to initial state, tick = 0 |

### Symbol Layer

The four buttons next to "Symbol:" switch the channel labels displayed on every node:

- **α–ζ** — Greek letters (default)
- **𒀀** — Sumerian cuneiform
- **𓀀** — Egyptian hieroglyphs
- **🌑** — Emoji lunar phases

The underlying logic is identical across all four representations — only the visual notation changes.

### State Readout

The amber badge next to the Tick counter shows the **Core node's current micro-state** (S₀–S₈). Below the visualization, a banner shows the current state description, the transition target (next state), and any active stack context.

### Sub-tabs

**Micro-State Table** — the complete S₀–S₈ transition table showing which channels are active, what stack state is held, the next transition, and descriptive notes for each state.

**Multi-Cultural Symbols** — the full α–ζ channel mapping across all four symbol layers, with semantic role descriptions for each channel.

**Channel Propagation** — the five pillars of the Pyri interpreter explained in detail: channel-based propagation, deterministic Hiero-Code transitions, multi-channel articulation cues, stack memory influence, and core stabilization logic.

**Interpreter Core** — the full Pyri interpreter pseudo-code, showing the complete propagation → transition → articulation → stack → stabilization cycle.

---

## 13. Navigation Reference

| Page | Path | Sidebar Section |
|---|---|---|
| Dashboard | `/` | Main |
| Runes | `/runes` | Main |
| Graph | `/graph` | Main |
| Programs | `/programs` | Main |
| Numerology | `/numerology` | Main |
| Glyphs | `/glyphs` | Main |
| Framework | `/framework` | Reference |
| Emotion Nodes | `/emotions` | Reference |
| Cosmologies | `/cosmology` | Reference |
| Pyri Network | `/pyri-network` | Reference |

---

## 14. Glossary

| Term | Definition |
|---|---|
| **ASE Vitality** | The àṣẹ-derived life-force property of a rune (0.0–1.0). Governs energy available for symbolic execution. |
| **Maat Balance** | Structural harmony derived from the 42 Laws of Maat (0.0–1.0). Governs validity and equilibrium of a rune's relationships. |
| **Sumerian Resonance** | A base-60 harmonic value encoding the rune's vibrational frequency in the Sumerian numerical tradition. |
| **Symbolic Procedure** | The executable expression associated with a rune, e.g. `WEIGH_HEART(feather=MAAT, soul=BA)`. |
| **PyriNode** | An autonomous computational unit in the Void Network with identity, state, weighted connections, and rules. |
| **Channel** | One of six propagation signals (α, β, γ, δ, ε, ζ) that carry influence between Pyri nodes. |
| **Micro-state** | One of nine deterministic states (S₀–S₈) through which a Pyri node cycles. |
| **Teotl** | The animating force in Nahua philosophy — continuous, dynamic, and self-generating. Parallel to àṣẹ and Dao. |
| **Nagual** | In Castaneda's framing, a mode of awareness beyond ordinary perception — the predictive detection layer in WEAVE > WALL. |
| **Dreamcatcher** | Ojibwe woven filter; in Hiero-Code, the archetype for intelligent permeability (WEAVE > WALL). |
| **S₀** | Void state — the initialization state from which all Pyri emergence begins. Maps to Chapter CLXXV "The Day of Not Being". |
| **Wu-Wei** | Daoist principle of non-forcing; maps to the Pyri core stabilization logic — let the system find its natural equilibrium. |
| **Àṣẹ** | Yorùbá term for the performative power / vital force underlying all existence. The ASE Vitality property is named after this. |
