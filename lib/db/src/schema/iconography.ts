import { pgTable, text, serial, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const iconographyEntriesTable = pgTable(
  "iconography_entries",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    english: text("english").notNull().default(""),
    category: text("category").notNull().default("Iconic Symbol"),
    meaning: text("meaning").notNull().default(""),
  },
  (table) => [index("iconography_category_idx").on(table.category)],
);

export const insertIconographyEntrySchema = createInsertSchema(
  iconographyEntriesTable,
).omit({ id: true });

export type InsertIconographyEntry = z.infer<typeof insertIconographyEntrySchema>;
export type IconographyEntry = typeof iconographyEntriesTable.$inferSelect;
