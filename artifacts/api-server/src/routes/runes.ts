import { Router } from "express";
import { db } from "@workspace/db";
import { runesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateRuneBody,
  UpdateRuneBody,
  GetRuneParams,
  UpdateRuneParams,
  DeleteRuneParams,
  ExecuteRuneParams,
  ExecuteRuneBody,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const runes = await db.select().from(runesTable).orderBy(runesTable.createdAt);
  res.json(runes.map(runeToApi));
});

router.post("/", async (req, res) => {
  const body = CreateRuneBody.parse(req.body);
  const [rune] = await db
    .insert(runesTable)
    .values({
      name: body.name,
      glyph: body.glyph,
      glyphSymbol: body.glyphSymbol,
      system: body.system,
      scale: body.scale,
      aseVitality: body.aseVitality,
      maatBalance: body.maatBalance,
      sumerianResonance: body.sumerianResonance,
      procedureCode: body.procedureCode,
      connections: body.connections ?? [],
      state: {},
    })
    .returning();
  res.status(201).json(runeToApi(rune));
});

router.get("/graph", async (req, res) => {
  const runes = await db.select().from(runesTable);
  const edges: { from: number; to: number; weight: number }[] = [];
  for (const rune of runes) {
    const conns = (rune.connections as number[]) ?? [];
    for (const toId of conns) {
      edges.push({ from: rune.id, to: toId, weight: rune.aseVitality });
    }
  }
  res.json({ nodes: runes.map(runeToApi), edges });
});

router.get("/:id", async (req, res) => {
  const { id } = GetRuneParams.parse({ id: Number(req.params.id) });
  const [rune] = await db.select().from(runesTable).where(eq(runesTable.id, id));
  if (!rune) return res.status(404).json({ error: "Not found" });
  res.json(runeToApi(rune));
});

router.put("/:id", async (req, res) => {
  const { id } = UpdateRuneParams.parse({ id: Number(req.params.id) });
  const body = UpdateRuneBody.parse(req.body);
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (body.name !== undefined) updates.name = body.name;
  if (body.glyph !== undefined) updates.glyph = body.glyph;
  if (body.glyphSymbol !== undefined) updates.glyphSymbol = body.glyphSymbol;
  if (body.aseVitality !== undefined) updates.aseVitality = body.aseVitality;
  if (body.maatBalance !== undefined) updates.maatBalance = body.maatBalance;
  if (body.sumerianResonance !== undefined) updates.sumerianResonance = body.sumerianResonance;
  if (body.procedureCode !== undefined) updates.procedureCode = body.procedureCode;
  if (body.connections !== undefined) updates.connections = body.connections;

  const [updated] = await db
    .update(runesTable)
    .set(updates)
    .where(eq(runesTable.id, id))
    .returning();
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(runeToApi(updated));
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteRuneParams.parse({ id: Number(req.params.id) });
  await db.delete(runesTable).where(eq(runesTable.id, id));
  res.status(204).send();
});

router.post("/:id/execute", async (req, res) => {
  const { id } = ExecuteRuneParams.parse({ id: Number(req.params.id) });
  const body = ExecuteRuneBody.safeParse(req.body).success
    ? ExecuteRuneBody.parse(req.body)
    : { inputValue: 0, context: {} };

  const [rune] = await db.select().from(runesTable).where(eq(runesTable.id, id));
  if (!rune) return res.status(404).json({ error: "Not found" });

  const inputValue = body.inputValue ?? (rune.lastOutput ?? 1);

  const steps: string[] = [];
  steps.push(`INVOKE ${rune.glyphSymbol} [${rune.name}]`);
  steps.push(`INPUT: ${inputValue}`);

  let output = inputValue;

  if (rune.procedureCode.includes("DOUBLE")) {
    output = inputValue * 2;
    steps.push(`DOUBLE → ${output}`);
  } else if (rune.procedureCode.includes("HALVE")) {
    output = inputValue / 2;
    steps.push(`HALVE → ${output}`);
  } else if (rune.procedureCode.includes("UNIT_FRACTION")) {
    const match = rune.procedureCode.match(/UNIT_FRACTION\((\d+)\)/);
    const n = match ? parseInt(match[1]) : 2;
    output = inputValue / n;
    steps.push(`UNIT_FRACTION(${n}) → ${output}`);
  } else if (rune.procedureCode.includes("SCALE_60")) {
    output = inputValue * rune.sumerianResonance;
    steps.push(`SCALE_60(${rune.sumerianResonance}) → ${output}`);
  } else if (rune.procedureCode.includes("ASE_AMPLIFY")) {
    output = inputValue * (1 + rune.aseVitality);
    steps.push(`ASE_AMPLIFY(${rune.aseVitality.toFixed(3)}) → ${output}`);
  } else if (rune.procedureCode.includes("MAAT_BALANCE")) {
    output = inputValue * rune.maatBalance;
    steps.push(`MAAT_BALANCE(${rune.maatBalance.toFixed(3)}) → ${output}`);
  } else {
    output = inputValue * rune.aseVitality;
    steps.push(`DEFAULT_PROPAGATE(ase=${rune.aseVitality}) → ${output}`);
  }

  const maatDeviation = Math.abs(output - inputValue) / Math.max(Math.abs(inputValue), 1);
  steps.push(`MAAT_CHECK: deviation=${maatDeviation.toFixed(4)}`);

  if (maatDeviation > (1 - rune.maatBalance)) {
    output = output * rune.maatBalance + inputValue * (1 - rune.maatBalance);
    steps.push(`MAAT_CORRECTION applied → ${output}`);
  }

  steps.push(`OUTPUT: ${output}`);

  const connections = (rune.connections as number[]) ?? [];
  steps.push(`PROPAGATE → [${connections.join(", ")}]`);

  await db
    .update(runesTable)
    .set({
      lastOutput: output,
      executionCount: rune.executionCount + 1,
      state: { ...(rune.state as object), lastInput: inputValue, lastOutput: output },
      updatedAt: new Date(),
    })
    .where(eq(runesTable.id, id));

  res.json({
    runeId: id,
    output,
    propagatedTo: connections,
    stateAfter: { lastInput: inputValue, lastOutput: output },
    maatDeviation,
    aseApplied: rune.aseVitality,
    steps,
  });
});

function runeToApi(rune: typeof runesTable.$inferSelect) {
  return {
    ...rune,
    connections: (rune.connections as number[]) ?? [],
    state: (rune.state as object) ?? {},
  };
}

export default router;
