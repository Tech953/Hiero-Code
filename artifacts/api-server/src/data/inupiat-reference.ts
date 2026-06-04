// Curated Iñupiaq reference data (hand-cleaned from the dictionary OCR, whose
// number/colour entries were too garbled to auto-parse). Iñupiaq counting is
// vigesimal (base-20) with a quinary (base-5) sub-structure: 6 = "5 + 1",
// 7 = "5 + 2", 15 = "three fives", 20 = "a whole person" (iñuiññaq).

export interface InupiatNumber {
  value: number;
  word: string;
  literal?: string;
}

// North Slope / Kober dialect forms, normalized.
export const INUPIAT_NUMBERS: InupiatNumber[] = [
  { value: 1, word: "atausiq" },
  { value: 2, word: "malġuk" },
  { value: 3, word: "piŋasut" },
  { value: 4, word: "sisamat" },
  { value: 5, word: "tallimat" },
  { value: 6, word: "itchaksrat" },
  { value: 7, word: "tallimat malġuk", literal: "five-two" },
  { value: 8, word: "tallimat piŋasut", literal: "five-three" },
  { value: 9, word: "quliŋŋutaiḷaq", literal: "lacking one to ten" },
  { value: 10, word: "qulit" },
  { value: 15, word: "akimiaq" },
  { value: 20, word: "iñuiññaq", literal: "a whole person (20 digits)" },
  { value: 40, word: "malġukipiaq", literal: "two persons" },
  { value: 60, word: "piŋasukipiaq", literal: "three persons" },
  { value: 80, word: "sisamakipiaq", literal: "four persons" },
  { value: 100, word: "tallimakipiaq", literal: "five persons" },
  { value: 400, word: "iñuiññaq iñuiññaił", literal: "twenty twenties" },
];

export interface InupiatColor {
  word: string;
  english: string;
}

export const INUPIAT_COLORS: InupiatColor[] = [
  { word: "qauluktaq", english: "black" },
  { word: "qatiqtaq", english: "white" },
  { word: "aupallaktaq", english: "red" },
  { word: "quŋŋuqtaq", english: "blue / green" },
  { word: "suŋaaqtaq", english: "yellow" },
  { word: "tunŋuqtaq", english: "dark / blue-black" },
  { word: "quġžuqtaq", english: "grey" },
];

export interface InupiatPhoneme {
  symbol: string;
  name: string;
  description: string;
}

// Iñupiaq writing key — the distinctive letters of the practical orthography.
export const INUPIAT_PHONEMES: InupiatPhoneme[] = [
  { symbol: "ġ", name: "gamma", description: "Voiced velar fricative (back 'g')" },
  { symbol: "ł", name: "barred-L", description: "Voiceless lateral fricative" },
  { symbol: "ḷ", name: "retroflex L", description: "Retroflex lateral approximant" },
  { symbol: "ñ", name: "enye", description: "Palatal nasal (as in 'canyon')" },
  { symbol: "ŋ", name: "eng", description: "Velar nasal (as in 'sing')" },
  { symbol: "q", name: "uvular Q", description: "Voiceless uvular stop (deep 'k')" },
  { symbol: "ż", name: "z-dot", description: "Voiced retroflex fricative" },
  { symbol: "k", name: "kak", description: "Voiceless velar stop" },
];
