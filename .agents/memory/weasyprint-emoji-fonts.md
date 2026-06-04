---
name: WeasyPrint emoji fonts
description: How to render emoji/pictographic glyphs in the PDF codex without tofu boxes
---

The PDF codex (`.local/pdf-build/generate.py`, WeasyPrint) cannot render color emoji or
modern (post-BMP) Unicode pictographs — DejaVu Sans only covers legacy BMP symbols, so
animal/object emoji (🐊 🦅 🪶 etc.) come out as tofu (□).

**Fix:** bundle a *monochrome* emoji TTF and reference it via `@font-face` ahead of DejaVu in
the font stack for the emoji spans. The Aztec day-sign chapter uses
`font-family: 'NotoEmoji', 'DejaVu Sans', sans-serif`.

**Why the download was non-obvious:** github raw / jsdelivr URLs for the font were intercepted
by the sandbox proxy and returned HTML error pages, not the TTF. The reliable source is Google
Fonts: fetch `https://fonts.googleapis.com/css2?family=Noto+Emoji` (with a browser User-Agent),
read the `fonts.gstatic.com/...ttf` URL out of the returned CSS, and curl that directly.

**How to apply:** any new PDF chapter needing emoji/pictographs must use the NotoEmoji stack and
keep `.local/pdf-build/fonts/NotoEmoji.ttf` present. Verify coverage with fontTools
`getBestCmap()` before relying on a glyph.
