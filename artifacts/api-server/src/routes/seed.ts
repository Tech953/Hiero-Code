import { Router } from "express";
import { db } from "@workspace/db";
import { runesTable, dictionaryEntriesTable, stelaeEntriesTable, iconographyEntriesTable, pnwArtEntriesTable, inuitSymbologyEntriesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import inupiatDictionary from "../data/inupiat-dictionary.json";
import egyptianStelae from "../data/egyptian-stelae.json";
import hinduIconography from "../data/hindu-iconography.json";
import northwestArt from "../data/northwest-art.json";
import inuitSymbology from "../data/inuit-symbology.json";

const router = Router();

type DictRow = {
  headword: string;
  gloss: string;
  dialects: string[];
  category: string;
  subcategory: string;
};

const COSMOLOGY_RUNES = [
  // ─── 42 Laws of Maat nodes ───
  {
    name: "Maat — Truth and Cosmic Order",
    glyph: "Maat Feather",
    glyphSymbol: "𓂝",
    system: "egyptian" as const,
    scale: "macro" as const,
    aseVitality: 0.85,
    maatBalance: 0.98,
    sumerianResonance: 42,
    procedureCode: `def MAAT_JUDGMENT(state, context):\n  # The 42 Laws of Maat — the Weighing of the Heart\n  # Maat is not a commandment but an affirmation of integrity\n  laws_kept = state.get("laws_kept", 42)\n  balance = laws_kept / 42  # Perfect score = all 42 laws honored\n  justified = balance >= context.get("maatBalance", 0.5)\n  return {"justified": justified, "maat_score": balance, "laws_kept": laws_kept}`,
    connections: [],
    state: {},
  },
  {
    name: "Hall of Two Truths — Weighing Ceremony",
    glyph: "Scale Balance",
    glyphSymbol: "𓃑",
    system: "egyptian" as const,
    scale: "macro" as const,
    aseVitality: 0.72,
    maatBalance: 0.95,
    sumerianResonance: 2,
    procedureCode: `def MAAT_BALANCE(state, context):\n  # Chapter CXXV: Hall of Two Truths\n  # Heart weighed against Maat's feather\n  # 42 Laws of Maat govern the judgment\n  balance = context.get("maatBalance", 0.5)\n  input_val = state.get("value", 1)\n  output = input_val * balance\n  deviation = abs(output - input_val) / max(abs(input_val), 1)\n  justified = deviation <= (1 - balance)\n  return {"value": output, "justified": justified, "maat_score": balance}`,
    connections: [],
    state: {},
  },
  {
    name: "Ra — The Solar Barque of Cosmic Order",
    glyph: "Sun Disk",
    glyphSymbol: "𓇳",
    system: "egyptian" as const,
    scale: "macro" as const,
    aseVitality: 0.92,
    maatBalance: 0.88,
    sumerianResonance: 60,
    procedureCode: `def SOLAR_CYCLE(state, context):\n  # Ra's daily journey — Maat accompanies the solar barque\n  # The cycle of order and renewal\n  phase = state.get("phase", 0)  # 0=dawn, 1=noon, 2=dusk, 3=tuat\n  vitality = context.get("aseVitality", 0.92)\n  output = vitality * (1 + (phase % 2) * 0.5)\n  return {"value": output, "phase": (phase + 1) % 4, "solar_barque": True}`,
    connections: [],
    state: {},
  },
  {
    name: "Thoth — Scribe of the Hall, God of Wisdom",
    glyph: "Ibis",
    glyphSymbol: "𓅝",
    system: "egyptian" as const,
    scale: "macro" as const,
    aseVitality: 0.78,
    maatBalance: 0.91,
    sumerianResonance: 8,
    procedureCode: `def THOTH_RECORD(state, context):\n  # Thoth records the outcome of the Weighing\n  # Wisdom (ogbón) and knowledge (ìmò) produce understanding (òye)\n  record = state.get("history", [])\n  entry = {"value": state.get("value", 1), "maat": context.get("maatBalance", 0.5)}\n  record.append(entry)\n  return {"history": record, "count": len(record), "value": state.get("value", 1)}`,
    connections: [],
    state: {},
  },

  // ─── Àṣẹ / Yorùbá nodes ───
  {
    name: "Àṣẹ — Yorùbá Performative Power",
    glyph: "Vital Force",
    glyphSymbol: "𓂋",
    system: "synthetic" as const,
    scale: "macro" as const,
    aseVitality: 0.99,
    maatBalance: 0.75,
    sumerianResonance: 1,
    procedureCode: `def ASE_AMPLIFY(state, context):\n  # Àṣẹ: performative power — vital/life force\n  # All things animate and inanimate possess àṣẹ\n  # The aláàse bridges órun (otherworld) and ayé (living realm)\n  vitality = context.get("aseVitality", 0.5)\n  output = state.get("value", 1) * (1 + vitality)\n  return {"value": output, "ase_applied": vitality, "realm_bridge": True}`,
    connections: [],
    state: {},
  },
  {
    name: "Órun — The Yorùbá Otherworld",
    glyph: "Spirit Realm",
    glyphSymbol: "𓌺",
    system: "dimensional" as const,
    scale: "void" as const,
    aseVitality: 0.88,
    maatBalance: 0.65,
    sumerianResonance: 9,
    procedureCode: `def ORUN_ACCESS(state, context):\n  # Órun: invisible realm of spiritual forces\n  # Abode of òrìṣà, iwin (spirits of sacred places), eégún (ancestors)\n  vitality = context.get("aseVitality", 0.88)\n  # Threshold crossing — permeable boundary between realms\n  orun_val = state.get("value", 1) * vitality * 1.5\n  return {"orun_value": orun_val, "threshold_crossed": True}`,
    connections: [],
    state: {},
  },
  {
    name: "Egúngún — Ancestor Masquerade",
    glyph: "Masquerade Spirit",
    glyphSymbol: "𓀀",
    system: "synthetic" as const,
    scale: "s-tier" as const,
    aseVitality: 0.81,
    maatBalance: 0.70,
    sumerianResonance: 7,
    procedureCode: `def EGUNGON_BRIDGE(state, context):\n  # Egúngún: the ancestor masquerade — mediator between realms\n  # Using inventive imagination (imojú mora) and àṣẹ\n  living_val = state.get("aye_value", state.get("value", 1))\n  ancestor_val = state.get("orun_value", living_val * 0.5)\n  # Bridged value flows between realms\n  bridged = (living_val + ancestor_val) * context.get("aseVitality", 0.5)\n  return {"value": bridged, "living": living_val, "ancestor": ancestor_val}`,
    connections: [],
    state: {},
  },

  // ─── Nahua / Teotl nodes ───
  {
    name: "Teotl — Nahua Sacred Energy",
    glyph: "Sacred Force",
    glyphSymbol: "🌺",
    system: "synthetic" as const,
    scale: "macro" as const,
    aseVitality: 0.96,
    maatBalance: 0.80,
    sumerianResonance: 1,
    procedureCode: `def TEOTL_TRANSMUTE(state, context):\n  # Teotl: the single, vital, dynamic, eternally self-generating sacred energy\n  # Nature is generated by teotl, from teotl, as flower and song (in xochitl in cuicatl)\n  value = state.get("value", 1)\n  polar_toggle = context.get("cycle_phase", 0) % 2\n  output = value * (1 + polar_toggle * 0.618)  # Golden ratio oscillation\n  return {"value": output, "teotl_phase": polar_toggle, "flower_song": True}`,
    connections: [],
    state: {},
  },
  {
    name: "Tonalli — Solar Head-Force",
    glyph: "Solar Crown",
    glyphSymbol: "𓇣",
    system: "synthetic" as const,
    scale: "micro" as const,
    aseVitality: 0.75,
    maatBalance: 0.60,
    sumerianResonance: 20,
    procedureCode: `def TONALLI_CHARGE(state, context):\n  # Tonalli: located in the head — from tona (heat)\n  # Provides character, vigor, energy for growth\n  # Acquired from the sun; may leave during dreams/shamanic journeys\n  solar_vitality = context.get("aseVitality", 0.5)\n  value = state.get("value", 1)\n  return {"value": value * solar_vitality * 1.2, "tonalli": solar_vitality, "source": "sun"}`,
    connections: [],
    state: {},
  },
  {
    name: "Teyolia — Heart Fire",
    glyph: "Heart Flame",
    glyphSymbol: "𓂀",
    system: "synthetic" as const,
    scale: "micro" as const,
    aseVitality: 0.70,
    maatBalance: 0.88,
    sumerianResonance: 13,
    procedureCode: `def TEYOLIA_DIVINE_FIRE(state, context):\n  # Teyolia: "that which gives life to people" — located in the heart\n  # Provides memory, vitality, emotion, knowledge, wisdom\n  # Likened to "divine fire" — goes beyond after death\n  balance = context.get("maatBalance", 0.5)\n  value = state.get("value", 1)\n  return {"value": value * balance, "memory": True, "divine_fire": balance, "postmortem": True}`,
    connections: [],
    state: {},
  },
  {
    name: "In Xochitl In Cuicatl — Flower and Song",
    glyph: "Creative Expression",
    glyphSymbol: "𓇼",
    system: "synthetic" as const,
    scale: "s-tier" as const,
    aseVitality: 0.88,
    maatBalance: 0.77,
    sumerianResonance: 5,
    procedureCode: `def FLOWER_AND_SONG(state, context):\n  # in xochitl, in cuicatl: teotl's artistic self-presentation\n  # Nature as sacred artist's ongoing creative performance\n  # "Life is flower and it is song"\n  value = state.get("value", 1)\n  flower = value * context.get("aseVitality", 0.5)\n  song = value * context.get("maatBalance", 0.5)\n  return {"flower": flower, "song": song, "value": (flower + song) / 2, "art": True}`,
    connections: [],
    state: {},
  },

  // ─── Daoist nodes ───
  {
    name: "Dao — The Formless Way",
    glyph: "The Way",
    glyphSymbol: "☯",
    system: "dimensional" as const,
    scale: "void" as const,
    aseVitality: 0.60,
    maatBalance: 0.85,
    sumerianResonance: 81,
    procedureCode: `def WU_WEI_FLOW(state, context):\n  # Wu-wei: selfless action — acting without selfish motive\n  # The Dao flows through non-resistance; leading from behind\n  value = state.get("value", 1)\n  # Do not force; let it settle at natural balance\n  natural = value * context.get("maatBalance", 0.5)\n  return {"value": natural, "wu_wei": True, "forced": False, "nameless": True}`,
    connections: [],
    state: {},
  },
  {
    name: "Yin-Yang — The Paired Poles",
    glyph: "Paired Polarity",
    glyphSymbol: "⊙",
    system: "elemental" as const,
    scale: "macro" as const,
    aseVitality: 0.50,
    maatBalance: 0.99,
    sumerianResonance: 2,
    procedureCode: `def YIN_YANG_BALANCE(state, context):\n  # Yin: inward, feminine, receptive, dark, quiet\n  # Yang: outward, masculine, active, bright, loud\n  # True balance at the center point between them\n  value = state.get("value", 1)\n  yin = value * 0.5\n  yang = value * 0.5\n  center = (yin + yang) / 2\n  return {"yin": yin, "yang": yang, "center": center, "value": center}`,
    connections: [],
    state: {},
  },
  {
    name: "Zhuangzi — The Butterfly Dream",
    glyph: "Butterfly Transform",
    glyphSymbol: "𓆑",
    system: "cognitive" as const,
    scale: "particle" as const,
    aseVitality: 0.65,
    maatBalance: 0.60,
    sumerianResonance: 2,
    procedureCode: `def BUTTERFLY_TRANSFORM(state, context):\n  # Zhuangzi dreamed he was a butterfly, then woke as a man\n  # "Between a man and a butterfly there is necessarily a barrier"\n  # The Transformation of Things — identity is radically indeterminate\n  value = state.get("value", 1)\n  is_butterfly = state.get("is_butterfly", False)\n  transformed = not is_butterfly\n  output = value * (1.618 if transformed else 0.618)\n  return {"value": output, "is_butterfly": transformed, "transformation": True}`,
    connections: [],
    state: {},
  },
  {
    name: "Daoist Naming Ritual — Ordering Through Words",
    glyph: "Sacred Word",
    glyphSymbol: "𓏛",
    system: "synthetic" as const,
    scale: "temporal" as const,
    aseVitality: 0.77,
    maatBalance: 0.72,
    sumerianResonance: 3,
    procedureCode: `def NAMING_RITUAL(state, context):\n  # Daoist ritual: names have cosmic ordering power\n  # Naming a demon strips it of power; naming a deity summons force\n  # Mirrors àṣẹ (spoken words possess àṣẹ) and Book of Dead Ch. XXV\n  name = state.get("name", context.get("rune_name", "Unnamed"))\n  if name and name != "Unnamed":\n    # Named entities gain ordering power\n    ordering_power = len(name) * 0.1 * context.get("aseVitality", 0.5)\n    return {"value": ordering_power, "named": True, "name": name}\n  return {"value": 0, "named": False, "nameless": True}`,
    connections: [],
    state: {},
  },

  // ─── Book of the Dead Chapter Nodes ───
  {
    name: "Coming Forth by Day — Pert em Hru",
    glyph: "Day Emergence",
    glyphSymbol: "𓅃",
    system: "egyptian" as const,
    scale: "temporal" as const,
    aseVitality: 0.90,
    maatBalance: 0.82,
    sumerianResonance: 1,
    procedureCode: `def EMERGE_FROM_TUAT(state, context):\n  # Chapter I: Pert em Hru — Coming Forth by Day\n  # The soul asserts its right to emerge from the Duat\n  # The oldest recorded declaration of the will to live\n  vitality = context.get("aseVitality", 0.9)\n  output = state.get("value", 1) * (1 + vitality)\n  return {"output": output, "status": "emerged", "realm": "ayé", "day": True}`,
    connections: [],
    state: {},
  },
  {
    name: "Sekhet-Hetep — Field of Peace",
    glyph: "Elysian Fields",
    glyphSymbol: "𓇏",
    system: "egyptian" as const,
    scale: "macro" as const,
    aseVitality: 0.78,
    maatBalance: 0.94,
    sumerianResonance: 110,
    procedureCode: `def ENTER_ELYSIAN(state, context):\n  # Chapter CX: Sekhet-Hetep — Field of Peace / Elysian Fields\n  # Arrival in the justified state — eternal steady equilibrium\n  balance = context.get("maatBalance", 0.94)\n  vitality = context.get("aseVitality", 0.78)\n  harmony = (balance + vitality) / 2\n  return {"value": state.get("value", 1), "harmony": harmony, "realm": "sekhet_hetep", "justified": True}`,
    connections: [],
    state: {},
  },
  {
    name: "The Day of Not Being — Void Crossing",
    glyph: "Primordial Void",
    glyphSymbol: "𓇉",
    system: "dimensional" as const,
    scale: "void" as const,
    aseVitality: 0.40,
    maatBalance: 0.55,
    sumerianResonance: 175,
    procedureCode: `def VOID_CROSSING(state, context):\n  # Chapter CLXXV: The Day of Not Being\n  # The oldest chapter — the soul crosses the void of non-existence\n  # Emerges renewed from utter negation\n  value = state.get("value", 1)\n  if value == 0:\n    # From absolute zero, emergence occurs\n    return {"value": 1, "emerged_from_void": True, "nameless": True}\n  void_factor = 1 - context.get("aseVitality", 0.4)\n  return {"value": value * void_factor, "void_traversal": True}`,
    connections: [],
    state: {},
  },

  // ─── Tree of Life nodes ───
  {
    name: "Egyptian Tree of Life — Water Cycle Resurrection",
    glyph: "Life Tree",
    glyphSymbol: "𓇼",
    system: "egyptian" as const,
    scale: "macro" as const,
    aseVitality: 0.83,
    maatBalance: 0.79,
    sumerianResonance: 9,
    procedureCode: `def TREE_OF_LIFE_CYCLE(state, context):\n  # Egyptian Tree of Life: spirit descends through underworld serpent-streams\n  # Ascends through trunk, held in branches as a bowl of water\n  # Then rises as evaporation — transpiration as resurrection metaphor\n  phase = state.get("phase", "descent")\n  value = state.get("value", 1)\n  phases = {"descent": 0.5, "subterranean": 0.7, "ascent": 1.2, "evaporation": 1.5}\n  multiplier = phases.get(phase, 1.0)\n  next_phases = {"descent": "subterranean", "subterranean": "ascent", "ascent": "evaporation", "evaporation": "descent"}\n  return {"value": value * multiplier, "phase": next_phases[phase], "cycle": True}`,
    connections: [],
    state: {},
  },
  {
    name: "Cayman — The Crust of the Mayan Earth",
    glyph: "Earth Surface",
    glyphSymbol: "𓆇",
    system: "mayan" as const,
    scale: "geological" as const,
    aseVitality: 0.74,
    maatBalance: 0.69,
    sumerianResonance: 9,
    procedureCode: `def CAYMAN_SURFACE(state, context):\n  # Mayan Cayman: the crust of the earth\n  # Subterranean streams (Serpents) carry spirits through 9 underworld levels\n  # Turn upward, surface, evaporate into sky\n  levels = state.get("underworld_level", 9)\n  value = state.get("value", 1)\n  if levels > 0:\n    # Still descending through underworld\n    return {"value": value * 0.8, "underworld_level": levels - 1, "ascending": False}\n  # Reached surface — now ascending\n  return {"value": value * context.get("aseVitality", 0.74) * 2, "surface": True, "ascending": True}`,
    connections: [],
    state: {},
  },

  // ─── Iñupiaq (Arctic) nodes ───
  {
    name: "Iñuiññaq — The Whole Person (Base-20)",
    glyph: "Iñuiññaq (20)",
    glyphSymbol: "iñuiññaq",
    system: "inupiat" as const,
    scale: "macro" as const,
    aseVitality: 0.80,
    maatBalance: 0.82,
    sumerianResonance: 20,
    procedureCode: `SCALE_20\ndef WHOLE_PERSON(state, context):\n  # Iñupiaq vigesimal: twenty = iñuiññaq, "a whole person" (all 20 digits)\n  # Counting scales by whole persons: 40 = two persons, 100 = five persons\n  value = state.get("value", 1)\n  return {"value": value * 20, "whole_persons": value, "base": 20}`,
    connections: [],
    state: {},
  },
  {
    name: "Tallimat — The Hand (Quinary Sub-Base)",
    glyph: "Tallimat (5)",
    glyphSymbol: "tallimat",
    system: "inupiat" as const,
    scale: "micro" as const,
    aseVitality: 0.68,
    maatBalance: 0.75,
    sumerianResonance: 5,
    procedureCode: `SUB_BASE_5\ndef HAND_QUANTIZE(state, context):\n  # Iñupiaq quinary sub-base: the hand of five fingers structures 6-19\n  # Six is "five-one", seven "five-two" — quantize toward the nearest five\n  value = state.get("value", 1)\n  return {"value": round(value / 5) * 5, "sub_base": 5, "hand": True}`,
    connections: [],
    state: {},
  },
  {
    name: "Iglu — The Insulating Shelter",
    glyph: "Iglu Shelter",
    glyphSymbol: "❄️",
    system: "inupiat" as const,
    scale: "geological" as const,
    aseVitality: 0.55,
    maatBalance: 0.93,
    sumerianResonance: 12,
    procedureCode: `IGLU_INSULATE\ndef IGLU_DAMPEN(state, context):\n  # Iglu: the snow-house holds warmth against Arctic volatility\n  # Dampen incoming signal toward the equilibrium (maat) point\n  value = state.get("value", 1)\n  balance = context.get("maatBalance", 0.93)\n  return {"value": value * (1 - balance) + balance, "insulated": True}`,
    connections: [],
    state: {},
  },
  {
    name: "Siniktuq — The Dormant Sleeper",
    glyph: "Barred-L",
    glyphSymbol: "ł",
    system: "inupiat" as const,
    scale: "temporal" as const,
    aseVitality: 0.30,
    maatBalance: 0.88,
    sumerianResonance: 60,
    procedureCode: `SINIK_DORMANT\ndef DORMANCY_HOLD(state, context):\n  # Sinik (sleep): the long polar night — hold value, accrue latent resonance\n  # The node sleeps until invoked, conserving its charge\n  value = state.get("value", 1)\n  return {"value": value, "dormant": True, "resonance": context.get("sumerianResonance", 60)}`,
    connections: [],
    state: {},
  },

  // ─── Aztec (Mexica) Calendar nodes ───
  {
    name: "Nahui Ollin — The Fifth Sun of Movement",
    glyph: "Ollin (Movement)",
    glyphSymbol: "🌀",
    system: "aztec" as const,
    scale: "s-tier" as const,
    aseVitality: 0.95,
    maatBalance: 0.62,
    sumerianResonance: 5,
    procedureCode: `NAHUI_OLLIN\ndef FIFTH_SUN(state, context):\n  # Nahui Ollin: 4-Movement, the present Fifth Sun, born at Teotihuacan\n  # Destined to end in earthquakes — an oscillating movement transform\n  import math\n  value = state.get("value", 1)\n  phase = math.sin(value)\n  vitality = context.get("aseVitality", 0.95)\n  return {"value": value * (1 + phase * vitality), "sun": 5, "movement": phase}`,
    connections: [],
    state: {},
  },
  {
    name: "Tonalpohualli — The 260-Day Sacred Count",
    glyph: "Cipactli (Crocodile)",
    glyphSymbol: "🐊",
    system: "aztec" as const,
    scale: "temporal" as const,
    aseVitality: 0.78,
    maatBalance: 0.84,
    sumerianResonance: 13,
    procedureCode: `TONALPOHUALLI_CYCLE\ndef SACRED_COUNT(state, context):\n  # Tonalpohualli: 20 day-signs interlock with 13 numbers = 260 days\n  # Each value wraps into the sacred ring; the day-sign governs fate\n  value = round(state.get("value", 1))\n  day = ((value % 260) + 260) % 260\n  return {"value": day, "day_sign": day % 20, "number": (day % 13) + 1, "cycle": 260}`,
    connections: [],
    state: {},
  },
  {
    name: "Xiuhpohualli — The 365-Day Year Count",
    glyph: "Pantli (20)",
    glyphSymbol: "🚩",
    system: "aztec" as const,
    scale: "macro" as const,
    aseVitality: 0.70,
    maatBalance: 0.90,
    sumerianResonance: 20,
    procedureCode: `SCALE_20\ndef YEAR_COUNT(state, context):\n  # Xiuhpohualli: 18 veintenas of 20 days + 5 nameless nemontemi = 365\n  # Vigesimal solar accounting; the year-bearer names the turning\n  value = state.get("value", 1)\n  return {"value": value * 20, "veintenas": 18, "nemontemi": 5, "year": 365}`,
    connections: [],
    state: {},
  },
  {
    name: "Cuauhtli — The Eagle Ascent",
    glyph: "Cuauhtli (Eagle)",
    glyphSymbol: "🦅",
    system: "aztec" as const,
    scale: "macro" as const,
    aseVitality: 0.88,
    maatBalance: 0.66,
    sumerianResonance: 15,
    procedureCode: `ASE_AMPLIFY\ndef EAGLE_ASCENT(state, context):\n  # Cuauhtli (day 15): the eagle, solar warrior climbing the sky\n  # Amplifies vitality as the sun rises toward zenith\n  value = state.get("value", 1)\n  vitality = context.get("aseVitality", 0.88)\n  return {"value": value * (1 + vitality), "ascent": True, "day_sign": "cuauhtli"}`,
    connections: [],
    state: {},
  },
];

router.post("/cosmology", async (req, res) => {
  try {
    // Check if cosmology runes already seeded
    const existing = await db.select().from(runesTable);
    const existingNames = new Set(existing.map(r => r.name));
    
    const toInsert = COSMOLOGY_RUNES.filter(r => !existingNames.has(r.name));
    
    if (toInsert.length === 0) {
      res.json({ message: "Cosmology runes already seeded", count: 0 });
      return;
    }

    const inserted = await db.insert(runesTable).values(toInsert).returning();
    res.json({ message: `Seeded ${inserted.length} cosmological rune nodes`, count: inserted.length, runes: inserted.map(r => ({ id: r.id, name: r.name })) });
  } catch (error) {
    req.log.error({ err: error }, "Cosmology seed error");
    res.status(500).json({ error: String(error) });
  }
});

router.post("/dictionary", async (req, res) => {
  try {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(dictionaryEntriesTable)
      .where(eq(dictionaryEntriesTable.language, "inupiat"));

    if (count > 0) {
      res.json({ message: "Inupiat dictionary already seeded", count });
      return;
    }

    const rows = inupiatDictionary as DictRow[];
    const values = rows.map((r) => ({
      language: "inupiat",
      headword: r.headword,
      gloss: r.gloss,
      dialects: r.dialects ?? [],
      category: r.category || "General",
      subcategory: r.subcategory ?? "",
    }));

    let total = 0;
    const chunkSize = 500;
    for (let i = 0; i < values.length; i += chunkSize) {
      const chunk = values.slice(i, i + chunkSize);
      const inserted = await db
        .insert(dictionaryEntriesTable)
        .values(chunk)
        .returning({ id: dictionaryEntriesTable.id });
      total += inserted.length;
    }

    res.json({ message: `Seeded ${total} Inupiat dictionary entries`, count: total });
  } catch (error) {
    req.log.error({ err: error }, "Dictionary seed error");
    res.status(500).json({ error: String(error) });
  }
});

type StelaRow = {
  plate?: string;
  title?: string;
  bmNumber?: string;
  objectType?: string;
  material?: string;
  provenance?: string;
  dimensions?: string;
  date?: string;
  dynasty?: string;
  acquisition?: string;
  description?: string;
  preservation?: string;
  bibliography?: string;
  rawText?: string;
};

router.post("/corpus", async (req, res) => {
  try {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(stelaeEntriesTable);

    if (count > 0) {
      res.json({ message: "Stelae corpus already seeded", count });
      return;
    }

    const rows = egyptianStelae as StelaRow[];
    const values = rows.map((r) => ({
      plate: r.plate ?? "",
      title: r.title || "(untitled object)",
      bmNumber: r.bmNumber ?? "",
      objectType: r.objectType || "Object",
      material: r.material ?? "",
      provenance: r.provenance ?? "",
      dimensions: r.dimensions ?? "",
      date: r.date ?? "",
      dynasty: r.dynasty ?? "",
      acquisition: r.acquisition ?? "",
      description: r.description ?? "",
      preservation: r.preservation ?? "",
      bibliography: r.bibliography ?? "",
      rawText: r.rawText ?? "",
    }));

    const inserted = await db
      .insert(stelaeEntriesTable)
      .values(values)
      .returning({ id: stelaeEntriesTable.id });

    res.json({
      message: `Seeded ${inserted.length} British Museum stelae entries`,
      count: inserted.length,
    });
  } catch (error) {
    req.log.error({ err: error }, "Corpus seed error");
    res.status(500).json({ error: String(error) });
  }
});

type IconRow = {
  name?: string;
  english?: string;
  category?: string;
  meaning?: string;
};

router.post("/iconography", async (req, res) => {
  try {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(iconographyEntriesTable);

    if (count > 0) {
      res.json({ message: "Hindu iconography already seeded", count });
      return;
    }

    const rows = hinduIconography as IconRow[];
    const values = rows.map((r) => ({
      name: r.name || "(unnamed)",
      english: r.english ?? "",
      category: r.category || "Iconic Symbol",
      meaning: r.meaning ?? "",
    }));

    const inserted = await db
      .insert(iconographyEntriesTable)
      .values(values)
      .returning({ id: iconographyEntriesTable.id });

    res.json({
      message: `Seeded ${inserted.length} Hindu iconography entries`,
      count: inserted.length,
    });
  } catch (error) {
    req.log.error({ err: error }, "Iconography seed error");
    res.status(500).json({ error: String(error) });
  }
});

type PnwArtRow = {
  title?: string;
  category?: string;
  summary?: string;
  body?: string;
};

router.post("/pnw-art", async (req, res) => {
  try {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pnwArtEntriesTable);

    if (count > 0) {
      res.json({ message: "Northwest Coast art already seeded", count });
      return;
    }

    const rows = northwestArt as PnwArtRow[];
    const values = rows.map((r) => ({
      title: r.title || "(untitled section)",
      category: r.category || "Overview",
      summary: r.summary ?? "",
      body: r.body ?? "",
    }));

    const inserted = await db
      .insert(pnwArtEntriesTable)
      .values(values)
      .returning({ id: pnwArtEntriesTable.id });

    res.json({
      message: `Seeded ${inserted.length} Northwest Coast art entries`,
      count: inserted.length,
    });
  } catch (error) {
    req.log.error({ err: error }, "Northwest Coast art seed error");
    res.status(500).json({ error: String(error) });
  }
});

router.post("/inuit-symbology", async (req, res) => {
  try {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(inuitSymbologyEntriesTable);

    if (count > 0) {
      res.json({ message: "Inuit symbology already seeded", count });
      return;
    }

    const rows = inuitSymbology as PnwArtRow[];
    const values = rows.map((r) => ({
      title: r.title || "(untitled section)",
      category: r.category || "Section",
      summary: r.summary ?? "",
      body: r.body ?? "",
    }));

    const inserted = await db
      .insert(inuitSymbologyEntriesTable)
      .values(values)
      .returning({ id: inuitSymbologyEntriesTable.id });

    res.json({
      message: `Seeded ${inserted.length} Inuit symbology entries`,
      count: inserted.length,
    });
  } catch (error) {
    req.log.error({ err: error }, "Inuit symbology seed error");
    res.status(500).json({ error: String(error) });
  }
});

export default router;
