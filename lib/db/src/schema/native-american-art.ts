import { pgTable, text, serial, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const nativeAmericanArtEntriesTable = pgTable(
  "native_american_art_entries",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    category: text("category").notNull().default("Foreword"),
    summary: text("summary").notNull().default(""),
    body: text("body").notNull().default(""),
  },
  (table) => [index("native_american_art_category_idx").on(table.category)],
);

export const insertNativeAmericanArtEntrySchema = createInsertSchema(
  nativeAmericanArtEntriesTable,
).omit({ id: true });

export type InsertNativeAmericanArtEntry = z.infer<
  typeof insertNativeAmericanArtEntrySchema
>;
export type NativeAmericanArtEntry =
  typeof nativeAmericanArtEntriesTable.$inferSelect;
