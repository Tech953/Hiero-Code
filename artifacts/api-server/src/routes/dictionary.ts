import { Router } from "express";
import { db } from "@workspace/db";
import { dictionaryEntriesTable } from "@workspace/db";
import { and, eq, ilike, or, sql, asc } from "drizzle-orm";

const router = Router();

router.get("/categories", async (req, res) => {
  const language = (req.query.language as string | undefined) ?? "inupiat";
  const rows = await db
    .select({
      category: dictionaryEntriesTable.category,
      count: sql<number>`count(*)::int`,
    })
    .from(dictionaryEntriesTable)
    .where(eq(dictionaryEntriesTable.language, language))
    .groupBy(dictionaryEntriesTable.category)
    .orderBy(asc(dictionaryEntriesTable.category));
  res.json(rows);
});

router.get("/", async (req, res) => {
  const language = (req.query.language as string | undefined) ?? "inupiat";
  const category = req.query.category as string | undefined;
  const search = (req.query.search as string | undefined)?.trim();
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(200, Math.max(1, Number(req.query.pageSize) || 50));

  const conditions = [eq(dictionaryEntriesTable.language, language)];
  if (category && category !== "all") {
    conditions.push(eq(dictionaryEntriesTable.category, category));
  }
  if (search) {
    const term = `%${search}%`;
    const match = or(
      ilike(dictionaryEntriesTable.headword, term),
      ilike(dictionaryEntriesTable.gloss, term),
    );
    if (match) conditions.push(match);
  }
  const where = and(...conditions);

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(dictionaryEntriesTable)
    .where(where);

  const entries = await db
    .select()
    .from(dictionaryEntriesTable)
    .where(where)
    .orderBy(asc(dictionaryEntriesTable.headword))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  res.json({
    entries: entries.map((e) => ({
      ...e,
      dialects: (e.dialects as string[]) ?? [],
    })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
});

export default router;
