import { pgTable, text, serial, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const dictionaryEntriesTable = pgTable(
  "dictionary_entries",
  {
    id: serial("id").primaryKey(),
    language: text("language").notNull().default("inupiat"),
    headword: text("headword").notNull(),
    gloss: text("gloss").notNull(),
    dialects: jsonb("dialects").notNull().default([]),
    category: text("category").notNull().default("General"),
    subcategory: text("subcategory").notNull().default(""),
  },
  (table) => [
    index("dictionary_language_idx").on(table.language),
    index("dictionary_category_idx").on(table.category),
  ],
);

export const insertDictionaryEntrySchema = createInsertSchema(
  dictionaryEntriesTable,
).omit({ id: true });

export type InsertDictionaryEntry = z.infer<typeof insertDictionaryEntrySchema>;
export type DictionaryEntry = typeof dictionaryEntriesTable.$inferSelect;
