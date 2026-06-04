import { pgTable, text, serial, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tibetanSymbolEntriesTable = pgTable(
  "tibetan_symbol_entries",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    category: text("category").notNull().default("Overview"),
    summary: text("summary").notNull().default(""),
    body: text("body").notNull().default(""),
  },
  (table) => [index("tibetan_symbol_category_idx").on(table.category)],
);

export const insertTibetanSymbolEntrySchema = createInsertSchema(
  tibetanSymbolEntriesTable,
).omit({ id: true });

export type InsertTibetanSymbolEntry = z.infer<
  typeof insertTibetanSymbolEntrySchema
>;
export type TibetanSymbolEntry = typeof tibetanSymbolEntriesTable.$inferSelect;
