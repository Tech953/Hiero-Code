import { Router } from "express";

const router = Router();

const GLYPHS = [
  // === Egyptian Numerals ===
  { id: 1, symbol: "𓏤", name: "Staff (1)", system: "egyptian", numericValue: 1, meaning: "Single unit, the tally mark", category: "numeral" },
  { id: 2, symbol: "𓎆", name: "Heel Bone (10)", system: "egyptian", numericValue: 10, meaning: "The first grouping, ten strokes", category: "numeral" },
  { id: 3, symbol: "𓍢", name: "Coil of Rope (100)", system: "egyptian", numericValue: 100, meaning: "The coil, one hundred", category: "numeral" },
  { id: 4, symbol: "𓆼", name: "Lotus Flower (1000)", system: "egyptian", numericValue: 1000, meaning: "Abundance, the lotus in bloom", category: "numeral" },
  { id: 5, symbol: "𓂭", name: "Bent Finger (10000)", system: "egyptian", numericValue: 10000, meaning: "Power of the pharaoh's hand", category: "numeral" },
  { id: 6, symbol: "𓆾", name: "Tadpole (100000)", system: "egyptian", numericValue: 100000, meaning: "The infinite multiplier", category: "numeral" },
  { id: 7, symbol: "𓁨", name: "Kneeling God (1000000)", system: "egyptian", numericValue: 1000000, meaning: "The god of eternity, a million", category: "numeral" },
  { id: 8, symbol: "𓊹", name: "Nefr (Zero/Balance)", system: "egyptian", numericValue: 0, meaning: "Beautiful-perfect, balance, the base", category: "special" },

  // === Egyptian Deities / Symbols ===
  { id: 9, symbol: "𓂀", name: "Eye of Horus", system: "egyptian", numericValue: 1, meaning: "Vision, protection, the fractions of the Wedjat — 1/2+1/4+1/8+1/16+1/32+1/64", category: "symbol" },
  { id: 10, symbol: "𓇳", name: "Sun Disk (Ra)", system: "egyptian", numericValue: 1, meaning: "Solar identity, the source of all light", category: "deity" },
  { id: 11, symbol: "𓊽", name: "Djed Pillar", system: "egyptian", numericValue: 1, meaning: "Stability, endurance, structural integrity", category: "symbol" },
  { id: 12, symbol: "𓋹", name: "Ankh", system: "egyptian", numericValue: 1, meaning: "Life force, the key of the Nile", category: "symbol" },
  { id: 13, symbol: "𓂸", name: "Was Sceptre", system: "egyptian", numericValue: 1, meaning: "Power and dominion", category: "symbol" },
  { id: 14, symbol: "𓁛", name: "Thoth (Ibis)", system: "egyptian", numericValue: 1, meaning: "Wisdom, mathematics, writing", category: "deity" },
  { id: 15, symbol: "𓀀", name: "Man (Seated)", system: "egyptian", numericValue: 1, meaning: "Unity, primal form, the first count", category: "figure" },
  { id: 16, symbol: "𓆑", name: "Horned Viper", system: "egyptian", numericValue: 10, meaning: "Transformation, the tenth power", category: "animal" },
  { id: 17, symbol: "𓂋", name: "Mouth (r)", system: "egyptian", numericValue: 1, meaning: "Speech, the glyph of one, output", category: "phonetic" },

  // === Sumerian Numerals ===
  { id: 18, symbol: "𒁹", name: "Ash (1)", system: "sumerian", numericValue: 1, meaning: "The single vertical wedge — the base unit", category: "numeral" },
  { id: 19, symbol: "𒐙", name: "U (10)", system: "sumerian", numericValue: 10, meaning: "Ten units in sexagesimal notation", category: "numeral" },
  { id: 20, symbol: "𒐚", name: "Géš (60)", system: "sumerian", numericValue: 60, meaning: "One sixty — the base unit of the cosmos. 60 divisible by 2,3,4,5,6", category: "numeral" },
  { id: 21, symbol: "𒐜", name: "Géš-U (600)", system: "sumerian", numericValue: 600, meaning: "Ten sixties — the administrative unit", category: "numeral" },
  { id: 22, symbol: "𒐞", name: "Šár (3600)", system: "sumerian", numericValue: 3600, meaning: "The great cycle — 60 squared, one shar", category: "numeral" },
  { id: 23, symbol: "𒐏", name: "Niš (20)", system: "sumerian", numericValue: 20, meaning: "Two tens, a score", category: "numeral" },
  { id: 24, symbol: "𒌋𒌋𒌋", name: "Ušu (30)", system: "sumerian", numericValue: 30, meaning: "Three tens, the lunar month", category: "numeral" },
  { id: 25, symbol: "𒐐", name: "Nimin (40)", system: "sumerian", numericValue: 40, meaning: "Two twenties", category: "numeral" },
  { id: 26, symbol: "𒐑", name: "Ninnu (50)", system: "sumerian", numericValue: 50, meaning: "Fifty, close to the great base", category: "numeral" },

  // === Sumerian Counting Words ===
  { id: 27, symbol: "𒀸", name: "Aš (Whole)", system: "sumerian", numericValue: 1, meaning: "The complete unit", category: "counting" },
  { id: 28, symbol: "𒁺", name: "Min (Two)", system: "sumerian", numericValue: 2, meaning: "Duality, paired forces", category: "counting" },
  { id: 29, symbol: "𒂗", name: "Eš (Three)", system: "sumerian", numericValue: 3, meaning: "Trinity, the triad of existence", category: "counting" },
  { id: 30, symbol: "𒅆", name: "Ia (Five)", system: "sumerian", numericValue: 5, meaning: "The hand, five fingers", category: "counting" },

  // === Sumerian Deities / Determinatives ===
  { id: 31, symbol: "𒀭", name: "Dingir (God)", system: "sumerian", numericValue: 1, meaning: "Divinity, the first determinative — sacred number 1", category: "determinative" },
  { id: 32, symbol: "𒄑", name: "Giš (Tree/Sixty)", system: "sumerian", numericValue: 60, meaning: "The great wood, also sixty — structural support", category: "determinative" },
  { id: 33, symbol: "𒂗𒍪", name: "Enki (Wisdom)", system: "sumerian", numericValue: 40, meaning: "God of wisdom, water, magic — 40 in the divine pantheon", category: "deity" },
  { id: 34, symbol: "𒁺𒌋", name: "Enlil (Air)", system: "sumerian", numericValue: 50, meaning: "God of wind and storm — 50 in the divine pantheon", category: "deity" },

  // === Mayan Numerals ===
  { id: 35, symbol: "•", name: "Mayan Dot (1)", system: "mayan", numericValue: 1, meaning: "Single dot — one unit in base-20 vigesimal system", category: "numeral" },
  { id: 36, symbol: "—", name: "Mayan Bar (5)", system: "mayan", numericValue: 5, meaning: "Horizontal bar — five units, the hand", category: "numeral" },
  { id: 37, symbol: "𝋠", name: "Mayan Shell (0)", system: "mayan", numericValue: 0, meaning: "The shell glyph — zero, the void, the placeholder", category: "numeral" },
  { id: 38, symbol: "••••\n———", name: "Mayan 9", system: "mayan", numericValue: 9, meaning: "Four dots + bar — nine, the Bolontiku underworld lords", category: "numeral" },
  { id: 39, symbol: "••••\n————", name: "Mayan 19", system: "mayan", numericValue: 19, meaning: "Four dots + three bars — maximum single-position value", category: "numeral" },
  { id: 40, symbol: "↑", name: "Mayan 20 (Next Layer)", system: "mayan", numericValue: 20, meaning: "Positional step — twenty, triggers the next vertical layer", category: "numeral" },
  { id: 41, symbol: "↑↑", name: "Mayan 400", system: "mayan", numericValue: 400, meaning: "Twenty squared — two positional layers up", category: "numeral" },
  { id: 42, symbol: "↑↑↑", name: "Mayan 8000", system: "mayan", numericValue: 8000, meaning: "Twenty cubed — the great calendrical cycle", category: "numeral" },

  // === Khoisan Click Phonemes ===
  { id: 43, symbol: "|", name: "Dental Click (C)", system: "khoisan", numericValue: 1, meaning: "Tip of tongue against front teeth, quickly withdrawn. IPA: | — Roman: C. Tongue position + ingress airflow + dental placement", category: "phoneme" },
  { id: 44, symbol: "‡", name: "Alveolar-Palatal Click (Tc)", system: "khoisan", numericValue: 2, meaning: "Tip of tongue against alveolar ridge and adjacent palate, released sharply downwards. IPA: ‡ — Roman: Tc", category: "phoneme" },
  { id: 45, symbol: "!", name: "Palatal Click (Q)", system: "khoisan", numericValue: 3, meaning: "Tongue pressed against upper palate, released sharply — like a cork pulled from a bottle. IPA: ! — Roman: Q", category: "phoneme" },
  { id: 46, symbol: "||", name: "Lateral Click (X)", system: "khoisan", numericValue: 4, meaning: "Click at the side of tongue held pressed against palate. IPA: || — Roman: X. Lateral tongue + side airflow + palate slide", category: "phoneme" },

  // === Pyri Emotion Nodes (QUERTY-derived) ===
  { id: 47, symbol: ">.<", name: "Frustration Node", system: "pyri", numericValue: -1, meaning: "High arousal, negative valence. Frustration / embarrassment. Valence: -1, Arousal: +1, Gesture: 0", category: "emotion" },
  { id: 48, symbol: "^.^", name: "Contentment Node", system: "pyri", numericValue: 1, meaning: "Low arousal, positive valence. Happiness / satisfaction. Valence: +1, Arousal: -1, Gesture: 0", category: "emotion" },
  { id: 49, symbol: "0.0", name: "Shock Node", system: "pyri", numericValue: 0, meaning: "Medium-high arousal, neutral valence. Attention / focus trigger. Valence: 0, Arousal: +1, Gesture: 0", category: "emotion" },
  { id: 50, symbol: "@.@", name: "Overload Node", system: "pyri", numericValue: -2, meaning: "High arousal, neutral-negative. Sensory overload detection. Valence: 0, Arousal: +2, Gesture: 2", category: "emotion" },
  { id: 51, symbol: "*_*", name: "Awe Node", system: "pyri", numericValue: 2, meaning: "High arousal, positive. Strong engagement / awe. Valence: +1, Arousal: +2, Gesture: 0", category: "emotion" },
  { id: 52, symbol: "$.$", name: "Motivation Node", system: "pyri", numericValue: 1, meaning: "Medium arousal, positive. Incentive / goal-seeking drive. Valence: +1, Arousal: 0, Gesture: 1", category: "emotion" },
  { id: 53, symbol: "U.U", name: "Defeat Node", system: "pyri", numericValue: -1, meaning: "Low arousal, negative. Resignation / passive state. Valence: -1, Arousal: -1, Gesture: 0", category: "emotion" },
  { id: 54, symbol: "\\(-.-)/", name: "Surrender Node", system: "pyri", numericValue: -1, meaning: "Medium arousal, negative gesture. Motor-expression mapping. Valence: -1, Arousal: 0, Gesture: 3", category: "emotion" },

  // === Iñupiaq Vigesimal Numerals (base-20, quinary sub-base) ===
  { id: 55, symbol: "atausiq", name: "Atausiq (1)", system: "inupiat", numericValue: 1, meaning: "One — the single unit", category: "numeral" },
  { id: 56, symbol: "tallimat", name: "Tallimat (5)", system: "inupiat", numericValue: 5, meaning: "Five — the hand, the quinary sub-base", category: "numeral" },
  { id: 57, symbol: "qulit", name: "Qulit (10)", system: "inupiat", numericValue: 10, meaning: "Ten — both hands", category: "numeral" },
  { id: 58, symbol: "akimiaq", name: "Akimiaq (15)", system: "inupiat", numericValue: 15, meaning: "Fifteen — three fives", category: "numeral" },
  { id: 59, symbol: "iñuiññaq", name: "Iñuiññaq (20)", system: "inupiat", numericValue: 20, meaning: "Twenty — 'a whole person', all twenty digits; the vigesimal base", category: "numeral" },
  { id: 60, symbol: "malġukipiaq", name: "Malġukipiaq (40)", system: "inupiat", numericValue: 40, meaning: "Forty — 'two whole persons'", category: "numeral" },

  // === Iñupiaq Writing-Key Phonemes ===
  { id: 61, symbol: "ŋ", name: "Eng", system: "inupiat", numericValue: 1, meaning: "Velar nasal phoneme (as in 'sing') — a single sound-channel", category: "phoneme" },
  { id: 62, symbol: "ġ", name: "Gamma", system: "inupiat", numericValue: 1, meaning: "Voiced velar fricative — the back 'g' of Iñupiaq", category: "phoneme" },
  { id: 63, symbol: "ł", name: "Barred-L", system: "inupiat", numericValue: 1, meaning: "Voiceless lateral fricative", category: "phoneme" },
  { id: 64, symbol: "ñ", name: "Enye", system: "inupiat", numericValue: 1, meaning: "Palatal nasal (as in 'canyon')", category: "phoneme" },

  // === Aztec Tonalpohualli Day-Signs (20-day cycle) ===
  { id: 65, symbol: "🐊", name: "Cipactli (Crocodile)", system: "aztec", numericValue: 1, meaning: "Day 1 — primordial earth-monster; genesis", category: "day-sign" },
  { id: 66, symbol: "🌬️", name: "Ehecatl (Wind)", system: "aztec", numericValue: 2, meaning: "Day 2 — breath of Quetzalcoatl; spirit", category: "day-sign" },
  { id: 67, symbol: "🏠", name: "Calli (House)", system: "aztec", numericValue: 3, meaning: "Day 3 — shelter, the western quarter; a year-bearer", category: "day-sign" },
  { id: 68, symbol: "🐇", name: "Tochtli (Rabbit)", system: "aztec", numericValue: 8, meaning: "Day 8 — fertility, pulque; a year-bearer of the south", category: "day-sign" },
  { id: 69, symbol: "💧", name: "Atl (Water)", system: "aztec", numericValue: 9, meaning: "Day 9 — flow; the flood that ended the Fourth Sun", category: "day-sign" },
  { id: 70, symbol: "🎋", name: "Acatl (Reed)", system: "aztec", numericValue: 13, meaning: "Day 13 — authority; year-bearer of the east", category: "day-sign" },
  { id: 71, symbol: "🐆", name: "Ocelotl (Jaguar)", system: "aztec", numericValue: 14, meaning: "Day 14 — night, earth; devourers of the First Sun", category: "day-sign" },
  { id: 72, symbol: "🦅", name: "Cuauhtli (Eagle)", system: "aztec", numericValue: 15, meaning: "Day 15 — sky, the solar warrior's ascent", category: "day-sign" },
  { id: 73, symbol: "🌀", name: "Ollin (Movement)", system: "aztec", numericValue: 17, meaning: "Day 17 — earthquake; the sign of the present Fifth Sun", category: "day-sign" },
  { id: 74, symbol: "🔪", name: "Tecpatl (Flint)", system: "aztec", numericValue: 18, meaning: "Day 18 — sacrifice, the obsidian blade; year-bearer north", category: "day-sign" },
  { id: 75, symbol: "🌸", name: "Xochitl (Flower)", system: "aztec", numericValue: 20, meaning: "Day 20 — beauty, song; completion of the count", category: "day-sign" },

  // === Aztec Vigesimal Numerals ===
  { id: 76, symbol: "🚩", name: "Pantli (20)", system: "aztec", numericValue: 20, meaning: "Flag — twenty (cempohualli), first vigesimal place", category: "numeral" },
  { id: 77, symbol: "🪶", name: "Tzontli (400)", system: "aztec", numericValue: 400, meaning: "Feather/hair — four hundred (centzontli), 20²", category: "numeral" },
  { id: 78, symbol: "👝", name: "Xiquipilli (8000)", system: "aztec", numericValue: 8000, meaning: "Incense bag — eight thousand (cenxiquipilli), 20³", category: "numeral" },
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
