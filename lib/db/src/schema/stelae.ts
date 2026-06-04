import { pgTable, text, serial, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const stelaeEntriesTable = pgTable(
  "stelae_entries",
  {
    id: serial("id").primaryKey(),
    plate: text("plate").notNull().default(""),
    title: text("title").notNull(),
    bmNumber: text("bm_number").notNull().default(""),
    objectType: text("object_type").notNull().default("Object"),
    material: text("material").notNull().default(""),
    provenance: text("provenance").notNull().default(""),
    dimensions: text("dimensions").notNull().default(""),
    date: text("date").notNull().default(""),
    dynasty: text("dynasty").notNull().default(""),
    acquisition: text("acquisition").notNull().default(""),
    description: text("description").notNull().default(""),
    preservation: text("preservation").notNull().default(""),
    bibliography: text("bibliography").notNull().default(""),
    rawText: text("raw_text").notNull().default(""),
  },
  (table) => [
    index("stelae_dynasty_idx").on(table.dynasty),
    index("stelae_object_type_idx").on(table.objectType),
  ],
);

export const insertStelaEntrySchema = createInsertSchema(stelaeEntriesTable).omit(
  { id: true },
);

export type InsertStelaEntry = z.infer<typeof insertStelaEntrySchema>;
export type StelaEntry = typeof stelaeEntriesTable.$inferSelect;
