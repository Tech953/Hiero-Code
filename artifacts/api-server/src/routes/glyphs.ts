import { Router } from "express";

const router = Router();

const GLYPHS = [
  { id: 1, symbol: "𓀀", name: "Man", system: "egyptian", numericValue: 1, meaning: "Unity, primal form, the first count", category: "figure" },
  { id: 2, symbol: "𓂀", name: "Eye of Horus", system: "egyptian", numericValue: 1, meaning: "Vision, protection, the fractions of the Wedjat", category: "symbol" },
  { id: 3, symbol: "𓆑", name: "Horned Viper", system: "egyptian", numericValue: 10, meaning: "Transformation, the tenth power", category: "animal" },
  { id: 4, symbol: "𓏤", name: "Staff (1)", system: "egyptian", numericValue: 1, meaning: "Single unit, the tally mark", category: "numeral" },
  { id: 5, symbol: "𓎆", name: "Heel Bone (10)", system: "egyptian", numericValue: 10, meaning: "The first grouping, ten strokes", category: "numeral" },
  { id: 6, symbol: "𓍢", name: "Coil of Rope (100)", system: "egyptian", numericValue: 100, meaning: "The coil, one hundred", category: "numeral" },
  { id: 7, symbol: "𓆼", name: "Lotus Flower (1000)", system: "egyptian", numericValue: 1000, meaning: "Abundance, the lotus in bloom", category: "numeral" },
  { id: 8, symbol: "𓂭", name: "Bent Finger (10000)", system: "egyptian", numericValue: 10000, meaning: "Power of the pharaoh's hand", category: "numeral" },
  { id: 9, symbol: "𓆾", name: "Tadpole (100000)", system: "egyptian", numericValue: 100000, meaning: "The infinite multiplier", category: "numeral" },
  { id: 10, symbol: "𓁨", name: "Kneeling God (1000000)", system: "egyptian", numericValue: 1000000, meaning: "The god of eternity, a million", category: "numeral" },
  { id: 11, symbol: "𓂋", name: "Mouth (r)", system: "egyptian", numericValue: 1, meaning: "Speech, the glyph of one, output", category: "phonetic" },
  { id: 12, symbol: "𓊹", name: "Nefr (Zero)", system: "egyptian", numericValue: 0, meaning: "Beautiful-perfect, balance, the base", category: "special" },
  { id: 13, symbol: "𒀭", name: "Dingir (God)", system: "sumerian", numericValue: 1, meaning: "Divinity, the first determinative", category: "determinative" },
  { id: 14, symbol: "𒁹", name: "One (1)", system: "sumerian", numericValue: 1, meaning: "Ash, the single vertical wedge", category: "numeral" },
  { id: 15, symbol: "𒐙", name: "Ten (10)", system: "sumerian", numericValue: 10, meaning: "U, ten units in sexagesimal", category: "numeral" },
  { id: 16, symbol: "𒐚", name: "Sixty (60)", system: "sumerian", numericValue: 60, meaning: "Ges, one sixty — the base unit of the cosmos", category: "numeral" },
  { id: 17, symbol: "𒐜", name: "Six Hundred (600)", system: "sumerian", numericValue: 600, meaning: "Ges-u, ten sixties", category: "numeral" },
  { id: 18, symbol: "𒐞", name: "Shar (3600)", system: "sumerian", numericValue: 3600, meaning: "The great cycle, 60 squared", category: "numeral" },
  { id: 19, symbol: "𒀸", name: "Aš (Whole)", system: "sumerian", numericValue: 1, meaning: "The complete unit", category: "counting" },
  { id: 20, symbol: "𒁺", name: "Min (Two)", system: "sumerian", numericValue: 2, meaning: "Duality, paired forces", category: "counting" },
  { id: 21, symbol: "𒂗", name: "Eš (Three)", system: "sumerian", numericValue: 3, meaning: "Trinity, the triad of existence", category: "counting" },
  { id: 22, symbol: "𒀭𒂗𒍪", name: "Limmu (Four)", system: "sumerian", numericValue: 4, meaning: "The four corners, spatial completion", category: "counting" },
  { id: 23, symbol: "𒅆", name: "Ia (Five)", system: "sumerian", numericValue: 5, meaning: "The hand, five fingers", category: "counting" },
  { id: 24, symbol: "𒐏", name: "Niš (Twenty)", system: "sumerian", numericValue: 20, meaning: "Two tens, a score", category: "numeral" },
  { id: 25, symbol: "𒌋𒌋𒌋", name: "Ušu (Thirty)", system: "sumerian", numericValue: 30, meaning: "Three tens, the lunar month", category: "numeral" },
  { id: 26, symbol: "𒐐", name: "Nimin (Forty)", system: "sumerian", numericValue: 40, meaning: "Two twenties", category: "numeral" },
  { id: 27, symbol: "𒐑", name: "Ninnu (Fifty)", system: "sumerian", numericValue: 50, meaning: "Fifty, close to the great base", category: "numeral" },
  { id: 28, symbol: "𓇳", name: "Sun Disk (Ra)", system: "egyptian", numericValue: 1, meaning: "Solar identity, the source of all light", category: "deity" },
  { id: 29, symbol: "𓊽", name: "Djed Pillar", system: "egyptian", numericValue: 1, meaning: "Stability, endurance, structural integrity", category: "symbol" },
  { id: 30, symbol: "𓋹", name: "Ankh", system: "egyptian", numericValue: 1, meaning: "Life force, the key of the Nile", category: "symbol" },
  { id: 31, symbol: "𓂸", name: "Was Sceptre", system: "egyptian", numericValue: 1, meaning: "Power and dominion", category: "symbol" },
  { id: 32, symbol: "𓁛", name: "Thoth (Ibis)", system: "egyptian", numericValue: 1, meaning: "Wisdom, mathematics, writing", category: "deity" },
  { id: 33, symbol: "𒄑", name: "Gis (Tree/Sixty)", system: "sumerian", numericValue: 60, meaning: "The great wood, also sixty — structural support", category: "determinative" },
  { id: 34, symbol: "𒀭𒂗𒍪", name: "An (Sky/Heaven)", system: "sumerian", numericValue: 1, meaning: "The heavens, primordial cosmos", category: "determinative" },
  { id: 35, symbol: "𒂗𒍪", name: "Enki (Wisdom)", system: "sumerian", numericValue: 40, meaning: "God of wisdom, water, magic — 40 in the pantheon", category: "deity" },
  { id: 36, symbol: "𒁺𒌋", name: "Enlil (Air)", system: "sumerian", numericValue: 50, meaning: "God of wind and storm — 50 in the pantheon", category: "deity" },
];

router.get("/", async (req, res) => {
  const system = req.query.system as string | undefined;
  let result = GLYPHS;
  if (system && system !== "all") {
    result = GLYPHS.filter((g) => g.system === system);
  }
  res.json(result);
});

export default router;
