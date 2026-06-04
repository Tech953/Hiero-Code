import { pgTable, text, serial, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pnwArtEntriesTable = pgTable(
  "pnw_art_entries",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    category: text("category").notNull().default("Overview"),
    summary: text("summary").notNull().default(""),
    body: text("body").notNull().default(""),
  },
  (table) => [index("pnw_art_category_idx").on(table.category)],
);

export const insertPnwArtEntrySchema = createInsertSchema(
  pnwArtEntriesTable,
).omit({ id: true });

export type InsertPnwArtEntry = z.infer<typeof insertPnwArtEntrySchema>;
export type PnwArtEntry = typeof pnwArtEntriesTable.$inferSelect;
