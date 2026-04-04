import { pgTable, text, serial, real, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const runesTable = pgTable("runes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  glyph: text("glyph").notNull(),
  glyphSymbol: text("glyph_symbol").notNull(),
  system: text("system").notNull(),
  scale: text("scale").notNull(),
  aseVitality: real("ase_vitality").notNull().default(0.5),
  maatBalance: real("maat_balance").notNull().default(0.5),
  sumerianResonance: real("sumerian_resonance").notNull().default(1),
  procedureCode: text("procedure_code").notNull().default(""),
  state: jsonb("state").notNull().default({}),
  connections: jsonb("connections").notNull().default([]),
  executionCount: integer("execution_count").notNull().default(0),
  lastOutput: real("last_output"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertRuneSchema = createInsertSchema(runesTable).omit({
  id: true,
  executionCount: true,
  lastOutput: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRune = z.infer<typeof insertRuneSchema>;
export type Rune = typeof runesTable.$inferSelect;
