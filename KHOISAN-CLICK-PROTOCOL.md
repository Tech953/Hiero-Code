# KHOISAN CLICK PROTOCOL

**Hiero-Code module specification — acoustic operation-code layer**

**Status:** Source reconciliation only. The README claims a 36-code cross-product, but the cited click inventory documents four click types and the language-alignment source describes acoustic features rather than the README's six operation modes. This specification records the claim and its evidence without filling those gaps by inference.

## 1. Scope and source set

This document reconciles the following repository sources:

| Ref | Source | Relevant material |
|---|---|---|
| **[R]** | `README.md`, “Khoisan Click Protocol — ML Inter-Component Communication” | Six click-to-domain rows, six companion-mode rows, two examples, and the 36-code claim |
| **[L]** | `attached_assets/HIERO-CODE_LANGUAGE_ALIGNMENT_1775275112271.csv`, section 3, “What Khoisan peoples solved: parallel audio channels” | Parallel acoustic features and the “4–6 simultaneous data channels” claim |
| **[W]** | Shelagh Willet, “Khoe-San names (African click languages),” *The Indexer* 25(4), 2007; repository text extract `attached_assets/Khoisan_Language_1775275145653.csv` | Table 1 click inventory, Table 2 indexing order, and Table 3 personal-name examples; Table 1 cites Le Roux and White (2004: ix) |

The second copy of the language-alignment CSV in `attached_assets/` contains the same section. The project source is an extracted document, not a new phonetic authority. Statements below are attributed to their source and are not presented as independently validated linguistic findings.

## 2. What the README actually claims

README [R] lists this click-to-domain table:

| Click | Roman | Domain |
|---|---|---|
| `|` | C | Memory / Data |
| `‡` | Tc | Arithmetic |
| `!` | Q | Logical / Activation |
| `||` | X | Control Flow |
| `ǂ` | Kx | Comparison / Gradient |
| `ʘ` | Pf | Synchronization |

It lists these six companion modes:

| Mode name | Code | README meaning |
|---|---|---|
| Plain | `∅` | Scalar |
| Voiced | `V` | Vector/Tensor |
| Aspirated | `H` | High-precision |
| Nasalized | `N` | Broadcast/Reduce |
| Glottalized | `G` | Gradient-tracked |
| Voiced+Nasal | `VN` | Distributed |

The README then states: **“6 click types × 6 companion modes = 36 base operation codes covering the complete functional surface of a computing system.”**

The README provides example spellings `C_VG` and `Tc_VNG`. Those examples combine modifier letters, while the six-row table treats `G` and `VN` as separate mode entries. The source does not define whether compound modifier strings are additional codes, combinations of table entries, or illustrative notation. They are therefore not added to the 36-entry inventory below.

## 3. What the language-alignment source says

Section 3 of [L] is headed **“What Khoisan peoples solved: parallel audio channels.”** It says:

> “They transmit multiple bits of information in one phoneme.”
>
> “A single click carries: ingress/egress airflow; tongue position; dental/alveolar/lateral location; accompaniment tone; nasalization.”
>
> “One ‘sound’ = 4–6 simultaneous data channels.”
>
> “Modern speech is serial. Khoisan speech is parallel.”

The section lists five feature categories and gives a 4–6 channel range. It does not define six named companion modes, assign those features to the README's mode codes, identify six click types, enumerate operation codes, or map acoustic features to Pyri channels. It supplies no cell-level operation-code mapping.

## 4. Willet inventory and canonical ordering

Willet [W], Table 1 (“Symbols for clicks”), says four clicks occur in most of the languages and gives these Naro Roman characters and descriptions:

| Table 1 IPA symbol | Naro Roman | Table 1 description |
|---|---|---|
| `|` | C | “Dental click: tip of the tongue is pressed against the front teeth and quickly withdrawn” |
| `‡` | Tc | “Alveolar-palatal click: tip of tongue is pressed against the alveolar ridge and adjacent palate, then released sharply downwards” |
| `!` | Q | “Click: tongue is pressed against the upper palate and released sharply downwards, something like when a cork is pulled from a bottle” |
| `||` | X | “Lateral click: the click sound produced at the side of the tongue when tongue is held pressed against the palate” |

The repository's Table 1 extract does not label the `!` / Q row “alveolar”; it labels it “Click” and supplies the articulation above. The source provided here does not resolve that terminology difference.

Willet [W], Table 2, gives this indexing order:

| Rank | Table 2 IPA symbol as extracted | Table 2 Naro Roman character | Table 1 identity |
|---:|---|---|---|
| 1 | `!` | Q | `!` / Q |
| 2 | `||` | X | `||` / X |
| 3 | `¦` | C | `|` / C |
| 4 | `‡` | Tc | `‡` / Tc |

The Table 2 text extract renders the third IPA symbol as `¦` (broken bar), whereas Table 1 renders it as `|`. The Roman column identifies that Table 2 position as C. The mapping below follows the Table 2 ranking for the four Table 1 clicks and preserves this glyph discrepancy rather than silently normalizing the source.

Table 2 describes **indexing order**, not a universal phonological ranking or operation priority. Willet notes that the sequence was an indexing decision and that other publications have used different arrangements. Table 3 gives personal-name examples; those examples do not define operation semantics or companion modes.

## 5. Audit of the 36 README-claimed codes

The spelling below follows the README's click Roman code plus one of its six listed mode codes. The four Willet-supported clicks are ordered by Table 2. `Kx` and `Pf` follow in a separate README-only section; Willet provides no Table 2 rank for them.

Evidence markers:

- **`[R + W1; mode R]`** — README [R] supplies the click-domain claim and the click × mode combination; Willet Table 1 [W1] documents the base click; the mode definition comes from README only. Neither [W] nor [L] validates the combined opcode as a linguistic unit.
- **`[R only; UNDEFINED in L/W]`** — README [R] claims the click and combination, but the click is absent from the four-item Willet inventory [W] and no opcode is defined by the language-alignment source [L]. It is not a cross-source-grounded canonical opcode.

### 5.1 Table 2-ordered clicks

| Table 2 rank | Click / README domain | `∅` | `V` | `H` | `N` | `G` | `VN` |
|---:|---|---|---|---|---|---|---|
| 1 | `!` / Q — Logical / Activation | `Q_∅` [R + W1; mode R] | `Q_V` [R + W1; mode R] | `Q_H` [R + W1; mode R] | `Q_N` [R + W1; mode R] | `Q_G` [R + W1; mode R] | `Q_VN` [R + W1; mode R] |
| 2 | `||` / X — Control Flow | `X_∅` [R + W1; mode R] | `X_V` [R + W1; mode R] | `X_H` [R + W1; mode R] | `X_N` [R + W1; mode R] | `X_G` [R + W1; mode R] | `X_VN` [R + W1; mode R] |
| 3 | `|` / C — Memory / Data | `C_∅` [R + W1; mode R] | `C_V` [R + W1; mode R] | `C_H` [R + W1; mode R] | `C_N` [R + W1; mode R] | `C_G` [R + W1; mode R] | `C_VN` [R + W1; mode R] |
| 4 | `‡` / Tc — Arithmetic | `Tc_∅` [R + W1; mode R] | `Tc_V` [R + W1; mode R] | `Tc_H` [R + W1; mode R] | `Tc_N` [R + W1; mode R] | `Tc_G` [R + W1; mode R] | `Tc_VN` [R + W1; mode R] |

These 24 entries are derivable as README cross-product claims and have a Table 1 click identity in Willet. Their mode semantics are README claims, not definitions in Willet or [L]; the sources do not establish these combinations as attested Khoisan phonological forms.

### 5.2 README-only clicks; canonical status undefined

| README click / domain | `∅` | `V` | `H` | `N` | `G` | `VN` |
|---|---|---|---|---|---|---|
| `ǂ` / Kx — Comparison / Gradient | `Kx_∅` [R only; UNDEFINED in L/W] | `Kx_V` [R only; UNDEFINED in L/W] | `Kx_H` [R only; UNDEFINED in L/W] | `Kx_N` [R only; UNDEFINED in L/W] | `Kx_G` [R only; UNDEFINED in L/W] | `Kx_VN` [R only; UNDEFINED in L/W] |
| `ʘ` / Pf — Synchronization | `Pf_∅` [R only; UNDEFINED in L/W] | `Pf_V` [R only; UNDEFINED in L/W] | `Pf_H` [R only; UNDEFINED in L/W] | `Pf_N` [R only; UNDEFINED in L/W] | `Pf_G` [R only; UNDEFINED in L/W] | `Pf_VN` [R only; UNDEFINED in L/W] |

These 12 cells preserve the README's claim for auditability; they are **not** source-reconciled members of a canonical 36-code Khoisan mapping. No Table 2 sort positions can be assigned to Kx or Pf from Willet's four-click table.

## 6. Pyri channel interface

**The mapping from a click opcode to a Pyri channel action is UNDEFINED.** None of [R], [L], or [W] specifies whether an opcode should activate, read, write, route, or otherwise affect `alpha`, `beta`, `gamma`, `delta`, `epsilon`, or `zeta`. The language-alignment source's acoustic feature list is not a mapping to the six Pyri channels. No click-to-channel assignment is proposed here.

Likewise, the sources do not specify whether an opcode changes a Pyri micro-state, how it would interact with S0–S8, how payload bits are encoded, or how a receiver decodes and validates an opcode. These are not inferred from the existing deterministic state engine or three-layer codec.

## 7. What is missing for a canonical encode/decode module

The three sources do not yield one fully source-grounded 36-opcode mapping. To resolve that gap, the specification needs:

1. **Two additional click definitions:** authoritative symbols, Naro/Roman labels, articulatory descriptions, and source citations for the README's `ǂ` / Kx and `ʘ` / Pf. They are not among Willet Table 1's four clicks.
2. **A canonical order for any added clicks:** Willet Table 2 ranks only its four listed clicks.
3. **Mode definitions and scope:** the README labels six modes and gives computing interpretations, but Willet does not define them and [L] lists different acoustic feature categories. A source or project decision must define their phonetic realization, whether they are mutually exclusive, and whether combinations such as `VG` and `VNG` are legal codes beyond the six listed modes.
4. **A channel-action contract:** define how an opcode selects or affects Pyri channels and whether it is state-dependent.
5. **An encoding contract:** define the payload representation, framing, validation/error handling, and a decoder rule. The operation-code claim alone does not specify a lossless codec.

Until those inputs are resolved, the four Table 2-ordered click identities and the README's claimed cross-product can be documented, but a source-reconciled canonical 36-code protocol and its Pyri encode/decode behavior remain **UNDEFINED**.
