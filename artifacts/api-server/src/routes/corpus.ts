import { Router } from "express";
import { db } from "@workspace/db";
import { stelaeEntriesTable } from "@workspace/db";
import { and, eq, ilike, or, sql, asc } from "drizzle-orm";

const router = Router();

router.get("/facets", async (_req, res) => {
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(stelaeEntriesTable);

  const dynasties = await db
    .select({
      value: stelaeEntriesTable.dynasty,
      count: sql<number>`count(*)::int`,
    })
    .from(stelaeEntriesTable)
    .groupBy(stelaeEntriesTable.dynasty)
    .orderBy(sql`count(*) desc`);

  const objectTypes = await db
    .select({
      value: stelaeEntriesTable.objectType,
      count: sql<number>`count(*)::int`,
    })
    .from(stelaeEntriesTable)
    .groupBy(stelaeEntriesTable.objectType)
    .orderBy(sql`count(*) desc`);

  res.json({
    total,
    dynasties: dynasties.map((d) => ({
      value: d.value || "Unattributed",
      count: d.count,
    })),
    objectTypes: objectTypes.map((d) => ({
      value: d.value || "Object",
      count: d.count,
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
    .from(stelaeEntriesTable)
    .where(eq(stelaeEntriesTable.id, id))
    .limit(1);
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(row);
});

router.get("/", async (req, res) => {
  const dynasty = req.query.dynasty as string | undefined;
  const objectType = req.query.objectType as string | undefined;
  const search = (req.query.search as string | undefined)?.trim();
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(200, Math.max(1, Number(req.query.pageSize) || 20));

  const conditions = [];
  if (dynasty && dynasty !== "all") {
    conditions.push(eq(stelaeEntriesTable.dynasty, dynasty));
  }
  if (objectType && objectType !== "all") {
    conditions.push(eq(stelaeEntriesTable.objectType, objectType));
  }
  if (search) {
    const term = `%${search}%`;
    const match = or(
      ilike(stelaeEntriesTable.title, term),
      ilike(stelaeEntriesTable.rawText, term),
      ilike(stelaeEntriesTable.bmNumber, term),
      ilike(stelaeEntriesTable.provenance, term),
    );
    if (match) conditions.push(match);
  }
  const where = conditions.length ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(stelaeEntriesTable)
    .where(where);

  const entries = await db
    .select()
    .from(stelaeEntriesTable)
    .where(where)
    .orderBy(asc(stelaeEntriesTable.id))
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
