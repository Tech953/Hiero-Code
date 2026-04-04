import { Router } from "express";
import { ConvertNumberBody } from "@workspace/api-zod";

const router = Router();

const EGYPTIAN_SYSTEM = {
  name: "Egyptian Hieroglyphic",
  base: 10,
  description: "Ancient Egyptian decimal system using pictographic symbols. Each power of 10 has a distinct hieroglyphic symbol. Numbers are additive — symbols are combined without positional value. Dating to at least 5000 BC, recorded on papyrus and carved in stone.",
  symbols: [
    { value: 1, symbol: "𓏤", name: "Stroke", unicode: "U+133E4" },
    { value: 10, symbol: "𓎆", name: "Heel Bone (Hobble)", unicode: "U+13386" },
    { value: 100, symbol: "𓍢", name: "Coil of Rope", unicode: "U+13362" },
    { value: 1000, symbol: "𓆼", name: "Lotus Flower", unicode: "U+131BC" },
    { value: 10000, symbol: "𓂭", name: "Bent Finger", unicode: "U+130AD" },
    { value: 100000, symbol: "𓆾", name: "Tadpole / Frog", unicode: "U+131BE" },
    { value: 1000000, symbol: "𓁨", name: "Kneeling God (Heh)", unicode: "U+13068" },
  ],
  fractions: [
    { fraction: "1/2", symbol: "𓂋", decimal: 0.5 },
    { fraction: "2/3", symbol: "𓐛", decimal: 0.6667 },
    { fraction: "3/4", symbol: "𓐜", decimal: 0.75 },
    { fraction: "1/3", symbol: "𓐚", decimal: 0.3333 },
    { fraction: "1/4", symbol: "𓍢𓏤𓏤𓏤𓏤", decimal: 0.25 },
    { fraction: "1/5", symbol: "𓎆𓏤𓏤𓏤𓏤𓏤", decimal: 0.2 },
    { fraction: "1/7", symbol: "𓎆𓏤𓏤𓏤𓏤𓏤𓏤𓏤", decimal: 0.1429 },
    { fraction: "1/10", symbol: "𓍢𓏤", decimal: 0.1 },
  ],
};

const SUMERIAN_SYSTEM = {
  name: "Sumerian Sexagesimal",
  base: 60,
  description: "Ancient Sumerian positional numeral system with base 60, developed c. 3000 BC. Still in use today for measuring time (60 seconds/minutes) and angles (360 degrees). Divisible by 2, 3, 4, 5, 6, 10, 12, 15, 20, and 30 — making it exceptionally powerful for calculation. Cuneiform wedge marks pressed into clay tablets.",
  symbols: [
    { value: 1, symbol: "𒁹", name: "Aš (One)", unicode: "U+12079" },
    { value: 2, symbol: "𒁹𒁹", name: "Min (Two)", unicode: "U+12079" },
    { value: 3, symbol: "𒁹𒁹𒁹", name: "Eš (Three)", unicode: "U+12079" },
    { value: 4, symbol: "𒁹𒁹𒁹𒁹", name: "Limmu (Four)", unicode: "U+12079" },
    { value: 5, symbol: "𒅆", name: "Ia (Five)", unicode: "U+12146" },
    { value: 6, symbol: "𒅆𒁹", name: "Aš (Six)", unicode: "U+12146" },
    { value: 7, symbol: "𒅆𒁹𒁹", name: "Imin (Seven)", unicode: "U+12146" },
    { value: 8, symbol: "𒅆𒁹𒁹𒁹", name: "Ussu (Eight)", unicode: "U+12146" },
    { value: 9, symbol: "𒅆𒁹𒁹𒁹𒁹", name: "Ilimmu (Nine)", unicode: "U+12146" },
    { value: 10, symbol: "𒐙", name: "U (Ten)", unicode: "U+12419" },
    { value: 20, symbol: "𒐏", name: "Niš (Twenty)", unicode: "U+1240F" },
    { value: 30, symbol: "𒌋𒌋𒌋", name: "Ušu (Thirty)", unicode: "U+1230B" },
    { value: 40, symbol: "𒐐", name: "Nimin (Forty)", unicode: "U+12410" },
    { value: 50, symbol: "𒐑", name: "Ninnu (Fifty)", unicode: "U+12411" },
    { value: 60, symbol: "𒐚", name: "Géš (Sixty)", unicode: "U+1241A" },
    { value: 600, symbol: "𒐜", name: "Géš-U (Six Hundred)", unicode: "U+1241C" },
    { value: 3600, symbol: "𒐞", name: "Šár (Three Thousand Six Hundred)", unicode: "U+1241E" },
    { value: 36000, symbol: "𒐠", name: "Šár-U (Thirty-Six Thousand)", unicode: "U+12420" },
    { value: 216000, symbol: "𒐢", name: "Šár-Gal (Great Šár)", unicode: "U+12422" },
  ],
  fractions: [
    { fraction: "1/2", symbol: "1/2 (igi-2)", decimal: 0.5 },
    { fraction: "1/3", symbol: "1/3 (igi-3)", decimal: 0.3333 },
    { fraction: "1/4", symbol: "1/4 (igi-4)", decimal: 0.25 },
    { fraction: "1/5", symbol: "1/5 (igi-5)", decimal: 0.2 },
    { fraction: "1/6", symbol: "1/6 (igi-6)", decimal: 0.1667 },
    { fraction: "1/10", symbol: "1/10 (igi-10)", decimal: 0.1 },
    { fraction: "1/12", symbol: "1/12 (igi-12)", decimal: 0.0833 },
    { fraction: "1/15", symbol: "1/15 (igi-15)", decimal: 0.0667 },
    { fraction: "1/20", symbol: "1/20 (igi-20)", decimal: 0.05 },
    { fraction: "1/30", symbol: "1/30 (igi-30)", decimal: 0.0333 },
    { fraction: "1/60", symbol: "1/60 (igi-60)", decimal: 0.0167 },
  ],
};

router.get("/egyptian", async (req, res) => {
  res.json(EGYPTIAN_SYSTEM);
});

router.get("/sumerian", async (req, res) => {
  res.json(SUMERIAN_SYSTEM);
});

router.post("/convert", async (req, res) => {
  const body = ConvertNumberBody.parse(req.body);
  const { value, fromSystem, toSystem } = body;

  let decimalValue = value;

  const egSymbols: Record<number, string> = {
    1000000: "𓁨",
    100000: "𓆾",
    10000: "𓂭",
    1000: "𓆼",
    100: "𓍢",
    10: "𓎆",
    1: "𓏤",
  };

  const toEgyptian = (n: number): { result: string; symbols: string[]; explanation: string } => {
    if (n <= 0) return { result: "𓊹", symbols: ["𓊹"], explanation: "Nfr — zero, perfect balance" };
    let remaining = Math.floor(n);
    const parts: string[] = [];
    const syms: string[] = [];
    for (const [val, sym] of Object.entries(egSymbols)
      .map(([k, v]) => [parseInt(k), v] as [number, string])
      .sort((a, b) => b[0] - a[0])) {
      const count = Math.floor(remaining / val);
      if (count > 0) {
        parts.push(`${count}×${sym}(${val})`);
        syms.push(...Array(count).fill(sym));
        remaining -= count * val;
      }
    }
    return {
      result: syms.join(""),
      symbols: syms,
      explanation: `${n} = ${parts.join(" + ")} (additive hieroglyphic notation)`,
    };
  };

  const toSumerian = (n: number): { result: string; symbols: string[]; explanation: string } => {
    if (n <= 0) return { result: "0", symbols: ["0"], explanation: "Zero (not formally expressed in early Sumerian)" };
    let remaining = Math.floor(n);
    const parts: string[] = [];
    const syms: string[] = [];
    const sexPlaces: number[] = [];
    let temp = remaining;
    while (temp > 0) {
      sexPlaces.unshift(temp % 60);
      temp = Math.floor(temp / 60);
    }
    if (sexPlaces.length === 0) sexPlaces.push(0);
    for (let i = 0; i < sexPlaces.length; i++) {
      const placeVal = Math.pow(60, sexPlaces.length - 1 - i);
      if (sexPlaces[i] > 0) {
        parts.push(`${sexPlaces[i]}×60^${sexPlaces.length - 1 - i}`);
        syms.push(`[${sexPlaces[i]}]`);
      }
    }
    const sexStr = sexPlaces.join(",");
    return {
      result: sexStr,
      symbols: syms,
      explanation: `${n} = ${sexPlaces.join(", ")} in base-60 notation (${parts.join(" + ")})`,
    };
  };

  let result: { result: string; symbols: string[]; explanation: string };

  if (toSystem === "egyptian") {
    result = toEgyptian(decimalValue);
  } else if (toSystem === "sumerian") {
    result = toSumerian(decimalValue);
  } else {
    result = {
      result: decimalValue.toString(),
      symbols: [decimalValue.toString()],
      explanation: `${decimalValue} in decimal notation`,
    };
  }

  res.json({
    originalValue: value,
    fromSystem,
    toSystem,
    result: result.result,
    symbols: result.symbols,
    explanation: result.explanation,
  });
});

export default router;
