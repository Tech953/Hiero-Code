import { Router } from "express";
import { db } from "@workspace/db";
import { runesTable, programsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/overview", async (req, res) => {
  const runes = await db.select().from(runesTable);
  const programs = await db.select().from(programsTable);

  const runesByScale: Record<string, number> = {};
  const runesBySystem: Record<string, number> = {};
  let aseSum = 0;
  let maatSum = 0;

  for (const rune of runes) {
    runesByScale[rune.scale] = (runesByScale[rune.scale] ?? 0) + 1;
    runesBySystem[rune.system] = (runesBySystem[rune.system] ?? 0) + 1;
    aseSum += rune.aseVitality;
    maatSum += rune.maatBalance;
  }

  const avgAseVitality = runes.length > 0 ? aseSum / runes.length : 0;
  const avgMaatBalance = runes.length > 0 ? maatSum / runes.length : 0;

  const recentActivity = [
    ...runes
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 3)
      .map((r) => ({
        type: "rune",
        description: `Rune ${r.glyphSymbol} [${r.name}] updated`,
        timestamp: r.updatedAt.toISOString(),
      })),
    ...programs
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 2)
      .map((p) => ({
        type: "program",
        description: `Program "${p.title}" modified`,
        timestamp: p.updatedAt.toISOString(),
      })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  res.json({
    totalRunes: runes.length,
    totalPrograms: programs.length,
    runesByScale,
    runesBySystem,
    avgAseVitality,
    avgMaatBalance,
    recentActivity,
  });
});

export default router;
