---
name: Reference-feature content sourcing
description: How "browsable reference" features in Hiero-Code are sourced when a copyrighted book is requested.
---

# Reference-feature content sourcing

When a user asks to import a copyrighted book in full as a browsable reference, decline the full-text import and instead build the dataset from **originally-authored factual entries** (general domain knowledge), NOT the book's text.

**Why:** A request to import Robert Beer's Tibetan symbolism book verbatim was declined for content policy; the user then approved building a fresh authored dataset covering the same *subject* (quantifiable cultural facts). This kept the feature shippable without reproducing protected expression.

**How to apply:** Mirror the established reference pattern (Maya / Native American Art / Polar Bear / Tibetan Symbolism): authored JSON dataset → Drizzle table `*_entries` (id/title/category/summary/body + category index) → API routes (GET `/`, `/facets`, `/:id`) → seed endpoint (existing-count guard + chunked insert) → OpenAPI paths+schemas + codegen → React page using generated hooks → nav wiring → PDF codex chapter. Note in replit.md that the data is authored, not from a copyrighted source.
