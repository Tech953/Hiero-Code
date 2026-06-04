// Curated Aztec (Mexica) calendar symbology.
// Source: David Stuart, "The Aztec Calendar Stone: King and Cosmos" and the
// Leyenda de los Soles. Day-sign order follows the tonalpohualli.

export interface AztecDaySign {
  position: number; // 1..20
  nahuatl: string;
  english: string;
  glyph: string; // emoji standing in for the pictographic sign
  meaning: string;
}

export interface AztecSun {
  order: number;
  name: string; // calendrical name
  english: string;
  destruction: string;
}

export interface AztecVeintena {
  position: number;
  name: string;
  english: string;
}

// ── The 20 day-signs of the tonalpohualli (260-day count) ──
export const AZTEC_DAY_SIGNS: AztecDaySign[] = [
  { position: 1, nahuatl: "Cipactli", english: "Crocodile", glyph: "🐊", meaning: "Primordial earth-monster; genesis, origin" },
  { position: 2, nahuatl: "Ehecatl", english: "Wind", glyph: "🌬️", meaning: "Breath of Quetzalcoatl; spirit, change" },
  { position: 3, nahuatl: "Calli", english: "House", glyph: "🏠", meaning: "Shelter, rest, the western quarter" },
  { position: 4, nahuatl: "Cuetzpalin", english: "Lizard", glyph: "🦎", meaning: "Abundance, regeneration, sun-warmth" },
  { position: 5, nahuatl: "Coatl", english: "Serpent", glyph: "🐍", meaning: "Life-energy, the eastern quarter" },
  { position: 6, nahuatl: "Miquiztli", english: "Death", glyph: "💀", meaning: "Transformation, the lord Mictlantecuhtli" },
  { position: 7, nahuatl: "Mazatl", english: "Deer", glyph: "🦌", meaning: "Grace, the hunt, sustenance" },
  { position: 8, nahuatl: "Tochtli", english: "Rabbit", glyph: "🐇", meaning: "Fertility, pulque, year-bearer of the south" },
  { position: 9, nahuatl: "Atl", english: "Water", glyph: "💧", meaning: "Flow, the flood that ended the 4th Sun" },
  { position: 10, nahuatl: "Itzcuintli", english: "Dog", glyph: "🐕", meaning: "Guide of the dead through Mictlan" },
  { position: 11, nahuatl: "Ozomatli", english: "Monkey", glyph: "🐒", meaning: "Play, art; the people of the 2nd Sun" },
  { position: 12, nahuatl: "Malinalli", english: "Grass", glyph: "🌿", meaning: "Endurance, the twisting of fibres" },
  { position: 13, nahuatl: "Acatl", english: "Reed", glyph: "🎋", meaning: "Authority, year-bearer of the east" },
  { position: 14, nahuatl: "Ocelotl", english: "Jaguar", glyph: "🐆", meaning: "Night, earth, the devourers of the 1st Sun" },
  { position: 15, nahuatl: "Cuauhtli", english: "Eagle", glyph: "🦅", meaning: "Sky, the warrior, the solar ascent" },
  { position: 16, nahuatl: "Cozcacuauhtli", english: "Vulture", glyph: "🦃", meaning: "Long life, wisdom of age" },
  { position: 17, nahuatl: "Ollin", english: "Movement", glyph: "🌀", meaning: "Earthquake; sign of the present Fifth Sun" },
  { position: 18, nahuatl: "Tecpatl", english: "Flint", glyph: "🔪", meaning: "Sacrifice, the obsidian blade, year-bearer north" },
  { position: 19, nahuatl: "Quiahuitl", english: "Rain", glyph: "🌧️", meaning: "Tlaloc; the fire-rain that ended the 3rd Sun" },
  { position: 20, nahuatl: "Xochitl", english: "Flower", glyph: "🌸", meaning: "Beauty, song, completion of the count" },
];

// ── The 13 day-numbers (trecena coefficients) ──
export const AZTEC_NUMBERS: { value: number; nahuatl: string }[] = [
  { value: 1, nahuatl: "Ce" },
  { value: 2, nahuatl: "Ome" },
  { value: 3, nahuatl: "Yei" },
  { value: 4, nahuatl: "Nahui" },
  { value: 5, nahuatl: "Macuilli" },
  { value: 6, nahuatl: "Chicuace" },
  { value: 7, nahuatl: "Chicome" },
  { value: 8, nahuatl: "Chicuei" },
  { value: 9, nahuatl: "Chiconahui" },
  { value: 10, nahuatl: "Mahtlactli" },
  { value: 11, nahuatl: "Mahtlactli once" },
  { value: 12, nahuatl: "Mahtlactli omome" },
  { value: 13, nahuatl: "Mahtlactli omei" },
];

// ── Vigesimal place-value numerals (Aztec arithmetic notation) ──
export const AZTEC_PLACE_VALUES: { value: number; nahuatl: string; glyph: string; name: string }[] = [
  { value: 1, nahuatl: "Ce", glyph: "•", name: "Dot (unit)" },
  { value: 20, nahuatl: "Cempohualli", glyph: "🚩", name: "Pantli (flag)" },
  { value: 400, nahuatl: "Centzontli", glyph: "🪶", name: "Tzontli (feather/hair)" },
  { value: 8000, nahuatl: "Cenxiquipilli", glyph: "👝", name: "Xiquipilli (incense bag)" },
];

// ── The Five Suns (cosmogonic eras), Leyenda de los Soles ──
export const AZTEC_SUNS: AztecSun[] = [
  { order: 1, name: "Nahui Ocelotl", english: "4 Jaguar", destruction: "Inhabitants devoured by jaguars" },
  { order: 2, name: "Nahui Ehecatl", english: "4 Wind", destruction: "Swept away by hurricanes; people became monkeys" },
  { order: 3, name: "Nahui Quiahuitl", english: "4 Rain", destruction: "Consumed by a rain of fire; people became turkeys" },
  { order: 4, name: "Nahui Atl", english: "4 Water", destruction: "Drowned in a great flood; people became fish" },
  { order: 5, name: "Nahui Ollin", english: "4 Movement", destruction: "The present Sun, fated to end in earthquakes" },
];

// ── Year-bearers: the four day-signs that can begin a year ──
export const AZTEC_YEAR_BEARERS: { nahuatl: string; english: string; direction: string }[] = [
  { nahuatl: "Acatl", english: "Reed", direction: "East" },
  { nahuatl: "Tecpatl", english: "Flint", direction: "North" },
  { nahuatl: "Calli", english: "House", direction: "West" },
  { nahuatl: "Tochtli", english: "Rabbit", direction: "South" },
];

// ── The 18 veintena months of the xiuhpohualli (365-day solar year) ──
export const AZTEC_VEINTENAS: AztecVeintena[] = [
  { position: 1, name: "Atlcahualo", english: "Ceasing of Water" },
  { position: 2, name: "Tlacaxipehualiztli", english: "Flaying of Men" },
  { position: 3, name: "Tozoztontli", english: "Lesser Vigil" },
  { position: 4, name: "Huey Tozoztli", english: "Great Vigil" },
  { position: 5, name: "Toxcatl", english: "Dryness" },
  { position: 6, name: "Etzalcualiztli", english: "Eating of Bean Porridge" },
  { position: 7, name: "Tecuilhuitontli", english: "Lesser Feast of the Lords" },
  { position: 8, name: "Huey Tecuilhuitl", english: "Great Feast of the Lords" },
  { position: 9, name: "Tlaxochimaco", english: "Bestowal of Flowers" },
  { position: 10, name: "Xocotl Huetzi", english: "Fall of the Fruit" },
  { position: 11, name: "Ochpaniztli", english: "Sweeping of the Roads" },
  { position: 12, name: "Teotleco", english: "Return of the Gods" },
  { position: 13, name: "Tepeilhuitl", english: "Feast of the Mountains" },
  { position: 14, name: "Quecholli", english: "Precious Feather" },
  { position: 15, name: "Panquetzaliztli", english: "Raising of Banners" },
  { position: 16, name: "Atemoztli", english: "Descent of Water" },
  { position: 17, name: "Tititl", english: "Stretching" },
  { position: 18, name: "Izcalli", english: "Resurrection / Growth" },
];

export const AZTEC_NEMONTEMI = {
  count: 5,
  name: "Nemontemi",
  english: "Five hollow, nameless, unlucky days completing the 365-day year",
};
