import { pgTable, text, serial, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const polarBearEntriesTable = pgTable(
  "polar_bear_entries",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    category: text("category").notNull().default("Overview"),
    summary: text("summary").notNull().default(""),
    body: text("body").notNull().default(""),
  },
  (table) => [index("polar_bear_category_idx").on(table.category)],
);

export const insertPolarBearEntrySchema = createInsertSchema(
  polarBearEntriesTable,
).omit({ id: true });

export type InsertPolarBearEntry = z.infer<typeof insertPolarBearEntrySchema>;
export type PolarBearEntry = typeof polarBearEntriesTable.$inferSelect;
