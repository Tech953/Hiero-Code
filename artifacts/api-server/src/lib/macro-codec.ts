/**
 * Macro-glyph three-layer codec.
 *
 * Makes PROPOSAL.md §3 ("Lossless Data Transfer — Macro-Hiero-Data Node
 * Architecture") executable. A payload is encoded into three categorically
 * separate channels, and ANY TWO channels reconstruct it exactly:
 *
 *   Channel 1 — Positional Frame: Sumerian base-60 digits   (~5.907 bits/digit)
 *   Channel 2 — Glyph Stack:      Mayan vigesimal, stacks of 4 base-20 digits
 *                                 (~17.29 bits/stack)
 *   Channel 3 — Click Channel:    Khoisan click phonemes, 64-symbol alphabet
 *                                 (exactly 6 bits/phoneme)
 *
 * Construction (a (3,2) erasure code, RAID-5 style): the payload is split
 * into shares A and B; channel 1 carries A, channel 2 carries B, channel 3
 * carries the parity P = A XOR B. A+B is the payload; A+P and B+P each
 * recover the missing share by XOR. Each channel frame also carries the
 * payload length, so the two surviving channels cross-check each other.
 *
 * Honesty box — what this module does and does not claim:
 *   - It guarantees recovery from the ERASURE of any one whole channel.
 *   - With all three channels present it DETECTS (via parity) that one
 *     channel is corrupted, but does not localize which — per-symbol
 *     corruption recovery (the proposal's "recoverable from neighboring
 *     positions") is not implemented here.
 *   - The click alphabet is the repo's four influxes (glyphs.ts ids 43–46)
 *     crossed with 16 accompaniment feature-combinations: 64 symbols,
 *     6 bits/phoneme — inside the proposal's 4–7 bit band, deliberately
 *     below the ~7.1-bit N|uu theoretical maximum.
 *   - Channels are symbol SEQUENCES (arrays). String renderings are for
 *     display; the arrays are canonical.
 *
 * Pure functions only: no IO, no randomness, no clock. Same payload in,
 * same encoding out — encodings are freezable as test vectors.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Channel alphabets
// ─────────────────────────────────────────────────────────────────────────────

/** Click influxes, exactly as defined in the repo glyph table (glyphs.ts). */
export const CLICK_INFLUXES = ["|", "‡", "!", "||"] as const;

/**
 * Accompaniment features, in fixed order: voiced (g), aspirated (h),
 * nasal (n), glottal (ʼ). The 16 accompaniments are the subsets of these
 * features — the cross-product structure real Khoisan accompaniment
 * systems (Taa, N|uu) are built from.
 */
export const CLICK_FEATURES = ["g", "h", "n", "ʼ"] as const;

function accompanimentSuffix(index: number): string {
  return CLICK_FEATURES.filter((_, bit) => (index >> bit) & 1).join("");
}

/** The 64 click phoneme symbols: 4 influxes × 16 accompaniments. */
export const CLICK_SYMBOLS: readonly string[] = CLICK_INFLUXES.flatMap((influx) =>
  Array.from({ length: 16 }, (_, i) => influx + accompanimentSuffix(i)),
);

const CLICK_INDEX = new Map(CLICK_SYMBOLS.map((s, i) => [s, i]));

/** Theoretical channel capacities, bits per symbol. */
export const CHANNEL_CAPACITY = {
  positional: Math.log2(60), // ≈ 5.907
  glyphStack: 4 * Math.log2(20), // ≈ 17.288 per 4-digit stack
  click: 6, // log2(64)
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface EncodedPayload {
  /** Payload length in bytes. Also carried in every channel's header. */
  length: number;
  /** Channel 1: base-60 digits (0–59), most significant first. Share A. */
  positional: number[];
  /** Channel 2: stacks of 4 base-20 digits (0–19). Share B. */
  glyphStacks: number[][];
  /** Channel 3: click phoneme symbols. Parity share P = A XOR B. */
  clicks: string[];
}

export type ChannelSet = Partial<
  Pick<EncodedPayload, "positional" | "glyphStacks" | "clicks">
>;

// ─────────────────────────────────────────────────────────────────────────────
// Big-int radix conversion (frames are byte strings read as big integers)
// ─────────────────────────────────────────────────────────────────────────────

function bytesToBigInt(bytes: Uint8Array): bigint {
  let v = 0n;
  for (const b of bytes) v = (v << 8n) | BigInt(b);
  return v;
}

function bigIntToBytes(v: bigint): Uint8Array {
  if (v === 0n) return new Uint8Array([0]);
  const out: number[] = [];
  let x = v;
  while (x > 0n) {
    out.push(Number(x & 0xffn));
    x >>= 8n;
  }
  return new Uint8Array(out.reverse());
}

function toBaseDigits(v: bigint, base: number): number[] {
  if (v === 0n) return [0];
  const b = BigInt(base);
  const digits: number[] = [];
  let x = v;
  while (x > 0n) {
    digits.push(Number(x % b));
    x /= b;
  }
  return digits.reverse();
}

function fromBaseDigits(digits: readonly number[], base: number, what: string): bigint {
  const b = BigInt(base);
  let v = 0n;
  for (const d of digits) {
    if (!Number.isInteger(d) || d < 0 || d >= base) {
      throw new Error(`${what}: digit ${d} out of range 0–${base - 1}`);
    }
    v = v * b + BigInt(d);
  }
  return v;
}

// ─────────────────────────────────────────────────────────────────────────────
// Framing: [0x01 sentinel][4-byte big-endian payload length][share bytes]
// The sentinel keeps big-int conversion from eating leading zero bytes.
// ─────────────────────────────────────────────────────────────────────────────

const HEADER_LEN = 4;

function frameShare(share: Uint8Array, payloadLength: number): Uint8Array {
  const frame = new Uint8Array(1 + HEADER_LEN + share.length);
  frame[0] = 0x01;
  frame[1] = (payloadLength >>> 24) & 0xff;
  frame[2] = (payloadLength >>> 16) & 0xff;
  frame[3] = (payloadLength >>> 8) & 0xff;
  frame[4] = payloadLength & 0xff;
  frame.set(share, 1 + HEADER_LEN);
  return frame;
}

function unframeShare(frameWithSentinel: Uint8Array, what: string): { payloadLength: number; share: Uint8Array } {
  if (frameWithSentinel.length < 1 + HEADER_LEN || frameWithSentinel[0] !== 0x01) {
    throw new Error(`${what}: malformed frame (missing sentinel/header)`);
  }
  const payloadLength =
    frameWithSentinel[1] * 2 ** 24 +
    frameWithSentinel[2] * 2 ** 16 +
    frameWithSentinel[3] * 2 ** 8 +
    frameWithSentinel[4];
  return { payloadLength, share: frameWithSentinel.slice(1 + HEADER_LEN) };
}

function xorBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  const out = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = a[i] ^ b[i];
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Encode
// ─────────────────────────────────────────────────────────────────────────────

export function encodePayload(data: Uint8Array): EncodedPayload {
  const n = data.length;
  const shareLen = Math.ceil(n / 2);

  const shareA = data.slice(0, shareLen);
  const shareB = new Uint8Array(shareLen);
  shareB.set(data.slice(shareLen));
  const shareP = xorBytes(shareA, shareB);

  const positional = toBaseDigits(bytesToBigInt(frameShare(shareA, n)), 60);

  const vigesimal = toBaseDigits(bytesToBigInt(frameShare(shareB, n)), 20);
  while (vigesimal.length % 4 !== 0) vigesimal.unshift(0); // leading zeros don't change the value
  const glyphStacks: number[][] = [];
  for (let i = 0; i < vigesimal.length; i += 4) glyphStacks.push(vigesimal.slice(i, i + 4));

  const clicks = toBaseDigits(bytesToBigInt(frameShare(shareP, n)), 64).map(
    (d) => CLICK_SYMBOLS[d],
  );

  return { length: n, positional, glyphStacks, clicks };
}

// ─────────────────────────────────────────────────────────────────────────────
// Decode — any two channels reconstruct; three channels also verify parity
// ─────────────────────────────────────────────────────────────────────────────

function frameFromPositional(digits: readonly number[]): Uint8Array {
  return bigIntToBytes(fromBaseDigits(digits, 60, "positional"));
}

function frameFromStacks(stacks: readonly number[][]): Uint8Array {
  const flat: number[] = [];
  for (const stack of stacks) {
    if (stack.length !== 4) throw new Error("glyphStacks: every stack must hold exactly 4 digits");
    flat.push(...stack);
  }
  return bigIntToBytes(fromBaseDigits(flat, 20, "glyphStacks"));
}

function frameFromClicks(symbols: readonly string[]): Uint8Array {
  const digits = symbols.map((s) => {
    const idx = CLICK_INDEX.get(s);
    if (idx === undefined) throw new Error(`clicks: unknown click symbol "${s}"`);
    return idx;
  });
  return bigIntToBytes(fromBaseDigits(digits, 64, "clicks"));
}

export function decodePayload(channels: ChannelSet): Uint8Array {
  const present = (["positional", "glyphStacks", "clicks"] as const).filter(
    (k) => channels[k] !== undefined,
  );
  if (present.length < 2) {
    throw new Error("decodePayload: at least two channels are required");
  }

  const recovered = new Map<string, { payloadLength: number; share: Uint8Array }>();
  if (channels.positional) {
    recovered.set("A", unframeShare(frameFromPositional(channels.positional), "positional"));
  }
  if (channels.glyphStacks) {
    recovered.set("B", unframeShare(frameFromStacks(channels.glyphStacks), "glyphStacks"));
  }
  if (channels.clicks) {
    recovered.set("P", unframeShare(frameFromClicks(channels.clicks), "clicks"));
  }

  const lengths = new Set([...recovered.values()].map((r) => r.payloadLength));
  if (lengths.size !== 1) {
    throw new Error("decodePayload: channels disagree on payload length");
  }
  const n = [...lengths][0];
  const shareLen = Math.ceil(n / 2);
  for (const [name, r] of recovered) {
    if (r.share.length !== shareLen) {
      throw new Error(`decodePayload: share ${name} has wrong length`);
    }
  }

  let a = recovered.get("A")?.share;
  let b = recovered.get("B")?.share;
  const p = recovered.get("P")?.share;

  if (a && b && p) {
    const expected = xorBytes(a, b);
    for (let i = 0; i < shareLen; i++) {
      if (expected[i] !== p[i]) {
        throw new Error("decodePayload: parity check failed — one channel is corrupted");
      }
    }
  }
  if (!a && b && p) a = xorBytes(b, p);
  if (!b && a && p) b = xorBytes(a, p);
  if (!a || !b) throw new Error("decodePayload: could not reconstruct shares");

  const out = new Uint8Array(n);
  out.set(a, 0);
  out.set(b.slice(0, n - shareLen), shareLen);
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Efficiency measurement — achieved bits per symbol vs theoretical capacity
// ─────────────────────────────────────────────────────────────────────────────

export interface EfficiencyReport {
  payloadBytes: number;
  positional: { symbols: number; bitsPerSymbol: number; capacity: number };
  glyphStack: { symbols: number; bitsPerSymbol: number; capacity: number };
  click: { symbols: number; bitsPerSymbol: number; capacity: number };
}

export function measureEfficiency(data: Uint8Array, encoded: EncodedPayload): EfficiencyReport {
  // Bits actually carried by a channel = the bit length of its frame
  // integer. (Nominal frame size would overstate it: a frame whose share
  // bytes start with zeros is a smaller integer than its byte length.)
  // Achieved bits/symbol therefore never exceeds the channel capacity.
  const bitLength = (v: bigint) => (v === 0n ? 0 : v.toString(2).length);
  const posBits = bitLength(fromBaseDigits(encoded.positional, 60, "positional"));
  const stackBits = bitLength(fromBaseDigits(encoded.glyphStacks.flat(), 20, "glyphStacks"));
  const clickDigits = encoded.clicks.map((s) => {
    const idx = CLICK_INDEX.get(s);
    if (idx === undefined) throw new Error(`clicks: unknown click symbol "${s}"`);
    return idx;
  });
  const clickBits = bitLength(fromBaseDigits(clickDigits, 64, "clicks"));
  return {
    payloadBytes: data.length,
    positional: {
      symbols: encoded.positional.length,
      bitsPerSymbol: posBits / encoded.positional.length,
      capacity: CHANNEL_CAPACITY.positional,
    },
    glyphStack: {
      symbols: encoded.glyphStacks.length,
      bitsPerSymbol: stackBits / encoded.glyphStacks.length,
      capacity: CHANNEL_CAPACITY.glyphStack,
    },
    click: {
      symbols: encoded.clicks.length,
      bitsPerSymbol: clickBits / encoded.clicks.length,
      capacity: CHANNEL_CAPACITY.click,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Glyph renderings (display only — the symbol arrays are canonical)
// ─────────────────────────────────────────────────────────────────────────────

const SUMERIAN_TEN = "\u{1230B}"; // 𒌋 CUNEIFORM SIGN U — ten
const SUMERIAN_ONE = "\u{12079}"; // 𒁹 CUNEIFORM SIGN DISH — one

/**
 * Render a base-60 digit the Sumerian way: tens wedges + ones wedges,
 * additively. Zero renders as a separator dot — historical sexagesimal
 * had no true zero sign for most of its life.
 */
export function sumerianDigitGlyph(digit: number): string {
  if (digit === 0) return "·";
  return SUMERIAN_TEN.repeat(Math.floor(digit / 10)) + SUMERIAN_ONE.repeat(digit % 10);
}

/** Render a base-20 digit as its Maya numeral (U+1D2E0 + digit). */
export function mayaDigitGlyph(digit: number): string {
  return String.fromCodePoint(0x1d2e0 + digit);
}

export function renderPositional(encoded: EncodedPayload): string {
  return encoded.positional.map(sumerianDigitGlyph).join(" ");
}

export function renderGlyphStacks(encoded: EncodedPayload): string {
  return encoded.glyphStacks.map((stack) => stack.map(mayaDigitGlyph).join("")).join(" ");
}

export function renderClicks(encoded: EncodedPayload): string {
  return encoded.clicks.join("");
}
