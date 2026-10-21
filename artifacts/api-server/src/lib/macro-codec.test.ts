/**
 * Verification tests for the macro-glyph three-layer codec.
 *
 * These tests freeze the claims of PROPOSAL.md §3 as executable criteria:
 *   - any two of the three channels reconstruct the payload exactly;
 *   - achieved bits per symbol approach, and never exceed, the theoretical
 *     capacities (base-60 ≈ 5.907, Mayan stack ≈ 17.288, click = 6);
 *   - the "DUBSAR" encoding below is a frozen test vector — if a change
 *     alters it, the change is a format change and must be deliberate.
 *
 * Runner: Node's built-in test runner via tsx (this artifact has no
 * vitest, and the repo's bundler-style extensionless imports need tsx's
 * resolver):
 *   npx tsx --test src/lib/macro-codec.test.ts
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  encodePayload,
  decodePayload,
  measureEfficiency,
  sumerianDigitGlyph,
  mayaDigitGlyph,
  CLICK_SYMBOLS,
  CLICK_INFLUXES,
  CHANNEL_CAPACITY,
} from "./macro-codec";

/** Deterministic pseudo-random bytes (LCG) — same vector every run. */
function randBytes(n: number): Uint8Array {
  const out = new Uint8Array(n);
  let s = 123456789;
  for (let i = 0; i < n; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    out[i] = s % 256;
  }
  return out;
}

const PAYLOADS: Array<[string, Uint8Array]> = [
  ["empty", new Uint8Array(0)],
  ["one byte", new Uint8Array([42])],
  ["odd length", randBytes(255)],
  ["4 KiB", randBytes(4096)],
];

describe("2-of-3 reconstruction (the proposal's core guarantee)", () => {
  for (const [name, payload] of PAYLOADS) {
    it(`roundtrips with all three channels: ${name}`, () => {
      assert.deepEqual(decodePayload(encodePayload(payload)), payload);
    });
    it(`roundtrips without the click channel: ${name}`, () => {
      const enc = encodePayload(payload);
      assert.deepEqual(
        decodePayload({ positional: enc.positional, glyphStacks: enc.glyphStacks }),
        payload,
      );
    });
    it(`roundtrips without the glyph stacks: ${name}`, () => {
      const enc = encodePayload(payload);
      assert.deepEqual(
        decodePayload({ positional: enc.positional, clicks: enc.clicks }),
        payload,
      );
    });
    it(`roundtrips without the positional channel: ${name}`, () => {
      const enc = encodePayload(payload);
      assert.deepEqual(
        decodePayload({ glyphStacks: enc.glyphStacks, clicks: enc.clicks }),
        payload,
      );
    });
  }

  it("refuses to decode from a single channel", () => {
    const enc = encodePayload(randBytes(64));
    assert.throws(() => decodePayload({ positional: enc.positional }), /at least two/);
    assert.throws(() => decodePayload({}), /at least two/);
  });

  it("refuses channels that disagree on payload length", () => {
    const a = encodePayload(randBytes(10));
    const b = encodePayload(randBytes(20));
    assert.throws(
      () => decodePayload({ positional: a.positional, clicks: b.clicks }),
      /disagree on payload length/,
    );
  });
});

describe("integrity", () => {
  it("detects a corrupted symbol when all three channels are present", () => {
    const enc = encodePayload(new TextEncoder().encode("integrity matters"));
    const clicks = [...enc.clicks];
    // Corrupt the LAST symbol: the frame header stays valid, the parity
    // share changes, and the parity check is what must catch it.
    const last = clicks.length - 1;
    clicks[last] = clicks[last] === "|g" ? "!" : "|g";
    assert.throws(() => decodePayload({ ...enc, clicks }), /parity check failed/);
  });

  it("rejects out-of-range digits and unknown click symbols", () => {
    const enc = encodePayload(randBytes(32));
    assert.throws(
      () => decodePayload({ positional: [60], glyphStacks: enc.glyphStacks }),
      /out of range/,
    );
    assert.throws(
      () => decodePayload({ positional: enc.positional, clicks: ["bogus"] }),
      /unknown click symbol/,
    );
  });

  it("is deterministic: same payload, same encoding", () => {
    const payload = randBytes(128);
    assert.deepEqual(encodePayload(payload), encodePayload(payload));
  });
});

describe("frozen test vector — 'DUBSAR'", () => {
  const enc = encodePayload(new TextEncoder().encode("DUBSAR"));

  it("matches the pinned encoding exactly", () => {
    assert.deepEqual(enc.positional, [7, 9, 0, 44, 19, 8, 4, 34, 51, 46]);
    assert.deepEqual(enc.glyphStacks, [
      [0, 0, 0, 17],
      [11, 16, 17, 9],
      [15, 8, 10, 0],
      [5, 18, 12, 2],
    ]);
    assert.deepEqual(enc.clicks, ["|n", "|", "|", "|", "|", "|hn", "|gn", "||g", "‡", "‡"]);
    assert.equal(enc.length, 6);
  });

  it("decodes back from the pinned vector", () => {
    assert.deepEqual(
      new TextDecoder().decode(decodePayload(enc)),
      "DUBSAR",
    );
  });
});

describe("measured efficiency vs the proposal's claims (4 KiB payload)", () => {
  const data = randBytes(4096);
  const eff = measureEfficiency(data, encodePayload(data));

  it("positional channel approaches log2(60) ≈ 5.907 bits/digit from below", () => {
    assert.ok(eff.positional.bitsPerSymbol > 5.7, `got ${eff.positional.bitsPerSymbol}`);
    assert.ok(eff.positional.bitsPerSymbol <= CHANNEL_CAPACITY.positional);
  });

  it("glyph stacks approach 4·log2(20) ≈ 17.288 bits/stack from below", () => {
    assert.ok(eff.glyphStack.bitsPerSymbol > 16.5, `got ${eff.glyphStack.bitsPerSymbol}`);
    assert.ok(eff.glyphStack.bitsPerSymbol <= CHANNEL_CAPACITY.glyphStack);
  });

  it("click channel sits in the proposal's 4–7 bit band, at 6 bits/phoneme", () => {
    assert.ok(eff.click.bitsPerSymbol > 5.7, `got ${eff.click.bitsPerSymbol}`);
    assert.ok(eff.click.bitsPerSymbol <= 6);
    assert.ok(eff.click.bitsPerSymbol >= 4 && eff.click.bitsPerSymbol <= 7);
  });
});

describe("alphabets and glyph renderings", () => {
  it("click alphabet is 64 unique symbols from the repo's four influxes", () => {
    assert.equal(CLICK_SYMBOLS.length, 64);
    assert.equal(new Set(CLICK_SYMBOLS).size, 64);
    assert.deepEqual([...CLICK_INFLUXES], ["|", "‡", "!", "||"]);
    for (const symbol of CLICK_SYMBOLS) {
      assert.ok(CLICK_INFLUXES.some((influx) => symbol.startsWith(influx)));
    }
  });

  it("renders Sumerian digits additively (tens wedges + ones wedges)", () => {
    assert.equal(sumerianDigitGlyph(0), "·");
    assert.equal(sumerianDigitGlyph(7), "\u{12079}".repeat(7));
    assert.equal(
      sumerianDigitGlyph(44),
      "\u{1230B}".repeat(4) + "\u{12079}".repeat(4),
    );
  });

  it("renders Maya digits from the Maya Numerals block", () => {
    assert.equal(mayaDigitGlyph(0), String.fromCodePoint(0x1d2e0));
    assert.equal(mayaDigitGlyph(19), String.fromCodePoint(0x1d2f3));
  });
});
