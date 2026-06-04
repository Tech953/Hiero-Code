import { Router } from "express";
import { db } from "@workspace/db";
import { tibetanSymbolEntriesTable } from "@workspace/db";
import { and, eq, ilike, or, sql, asc } from "drizzle-orm";

const router = Router();

router.get("/facets", async (_req, res) => {
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(tibetanSymbolEntriesTable);

  const categories = await db
    .select({
      value: tibetanSymbolEntriesTable.category,
      count: sql<number>`count(*)::int`,
    })
    .from(tibetanSymbolEntriesTable)
    .groupBy(tibetanSymbolEntriesTable.category)
    .orderBy(sql`count(*) desc`);

  res.json({
    total,
    categories: categories.map((c) => ({
      value: c.value || "Overview",
      count: c.count,
    })),
  });
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const [row] = await db
    .select()
    .from(tibetanSymbolEntriesTable)
    .where(eq(tibetanSymbolEntriesTable.id, id))
    .limit(1);
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(row);
});

router.get("/", async (req, res) => {
  const category = req.query.category as string | undefined;
  const search = (req.query.search as string | undefined)?.trim();
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(200, Math.max(1, Number(req.query.pageSize) || 20));

  const conditions = [];
  if (category && category !== "all") {
    conditions.push(eq(tibetanSymbolEntriesTable.category, category));
  }
  if (search) {
    const term = `%${search}%`;
    const match = or(
      ilike(tibetanSymbolEntriesTable.title, term),
      ilike(tibetanSymbolEntriesTable.summary, term),
      ilike(tibetanSymbolEntriesTable.body, term),
    );
    if (match) conditions.push(match);
  }
  const where = conditions.length ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(tibetanSymbolEntriesTable)
    .where(where);

  const entries = await db
    .select()
    .from(tibetanSymbolEntriesTable)
    .where(where)
    .orderBy(asc(tibetanSymbolEntriesTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  res.json({
    entries,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
});

export default router;
