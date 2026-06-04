import { pgTable, text, serial, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const inuitSymbologyEntriesTable = pgTable(
  "inuit_symbology_entries",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    category: text("category").notNull().default("Section"),
    summary: text("summary").notNull().default(""),
    body: text("body").notNull().default(""),
  },
  (table) => [index("inuit_symbology_category_idx").on(table.category)],
);

export const insertInuitSymbologyEntrySchema = createInsertSchema(
  inuitSymbologyEntriesTable,
).omit({ id: true });

export type InsertInuitSymbologyEntry = z.infer<
  typeof insertInuitSymbologyEntrySchema
>;
export type InuitSymbologyEntry =
  typeof inuitSymbologyEntriesTable.$inferSelect;
