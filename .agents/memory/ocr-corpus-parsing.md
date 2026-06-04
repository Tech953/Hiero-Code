---
name: OCR corpus parsing for reference imports
description: Gotchas when parsing OCR-scanned text dumps into Hiero-Code reference datasets (Stelae, Hindu Iconography pattern)
---

# OCR corpus parsing

When importing OCR-scanned reference dumps as a browsable corpus, two recurring traps:

- **Line-count mismatch from Unicode line separators.** OCR source files often contain
  Unicode line/paragraph separators (U+2028/U+2029). Python `str.splitlines()` splits on
  these, inflating the line count vs `grep`/`cat -n` (e.g. 1067 vs 1049). Use `text.split("\n")`
  so your 1-indexed line ranges line up with what you see in `grep`/`cat -n`.
  **Why:** curated line-range pairings are derived against grep output; a mismatch silently shifts every pairing.

- **Run-based zip pairing of name→meaning blocks is unreliable.** OCR glues right-column
  meanings into inconsistent page-sized blobs, so "zip consecutive name-blocks to consecutive
  meaning-blocks" mispairs. For the iconic-symbol glossary, pair each symbol to its meaning by
  an explicit curated 1-indexed source line range instead of run-zip. Auto-parsing by header
  markers still works for theory/feature/mudra sections.
  **How to apply:** any new OCR reference import that mirrors the Stelae/Iconography pattern.

- **Form-feed (\x0c) is a page-break, not a heading delimiter.** OCR'd PDF prose prefixes chapter
  headings with a form-feed, but the same char also appears at mid-chapter page continuations, so
  splitting on it over-segments. Prefer curated SECTION_SPECS (start-line + title + category) over
  auto-detecting headings by \x0c.
  **Why:** treating every form-feed as a chapter start fractures single chapters into noise fragments.
