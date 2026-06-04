import { pgTable, text, serial, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const mayaGlyphEntriesTable = pgTable(
  "maya_glyph_entries",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    category: text("category").notNull().default("Introduction"),
    summary: text("summary").notNull().default(""),
    body: text("body").notNull().default(""),
  },
  (table) => [index("maya_glyph_category_idx").on(table.category)],
);

export const insertMayaGlyphEntrySchema = createInsertSchema(
  mayaGlyphEntriesTable,
).omit({ id: true });

export type InsertMayaGlyphEntry = z.infer<typeof insertMayaGlyphEntrySchema>;
export type MayaGlyphEntry = typeof mayaGlyphEntriesTable.$inferSelect;
