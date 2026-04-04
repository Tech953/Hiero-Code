import { Router } from "express";
import { db } from "@workspace/db";
import { programsTable, runesTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import {
  CreateProgramBody,
  UpdateProgramBody,
  GetProgramParams,
  UpdateProgramParams,
  DeleteProgramParams,
  RunProgramParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const programs = await db.select().from(programsTable).orderBy(programsTable.createdAt);
  res.json(programs.map(programToApi));
});

router.post("/", async (req, res) => {
  const body = CreateProgramBody.parse(req.body);
  const [program] = await db
    .insert(programsTable)
    .values({
      title: body.title,
      description: body.description ?? "",
      code: body.code,
      runeIds: body.runeIds ?? [],
    })
    .returning();
  res.status(201).json(programToApi(program));
});

router.get("/:id", async (req, res) => {
  const { id } = GetProgramParams.parse({ id: Number(req.params.id) });
  const [program] = await db.select().from(programsTable).where(eq(programsTable.id, id));
  if (!program) return res.status(404).json({ error: "Not found" });
  res.json(programToApi(program));
});

router.put("/:id", async (req, res) => {
  const { id } = UpdateProgramParams.parse({ id: Number(req.params.id) });
  const body = UpdateProgramBody.parse(req.body);
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (body.title !== undefined) updates.title = body.title;
  if (body.description !== undefined) updates.description = body.description;
  if (body.code !== undefined) updates.code = body.code;
  if (body.runeIds !== undefined) updates.runeIds = body.runeIds;

  const [updated] = await db
    .update(programsTable)
    .set(updates)
    .where(eq(programsTable.id, id))
    .returning();
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(programToApi(updated));
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteProgramParams.parse({ id: Number(req.params.id) });
  await db.delete(programsTable).where(eq(programsTable.id, id));
  res.status(204).send();
});

router.post("/:id/run", async (req, res) => {
  const { id } = RunProgramParams.parse({ id: Number(req.params.id) });
  const [program] = await db.select().from(programsTable).where(eq(programsTable.id, id));
  if (!program) return res.status(404).json({ error: "Not found" });

  const runeIds = (program.runeIds as number[]) ?? [];

  let runes: (typeof runesTable.$inferSelect)[] = [];
  if (runeIds.length > 0) {
    runes = await db.select().from(runesTable).where(inArray(runesTable.id, runeIds));
    runes = runeIds.map((rid) => runes.find((r) => r.id === rid)!).filter(Boolean);
  }

  const steps: {
    stepIndex: number;
    runeId?: number;
    runeName: string;
    glyphSymbol: string;
    input: number;
    output: number;
    description: string;
  }[] = [];

  let value = 1.0;
  let maatTotal = 0;
  const start = Date.now();

  for (let i = 0; i < runes.length; i++) {
    const rune = runes[i];
    const input = value;

    let output = input;
    let desc = `Invoke ${rune.name}`;

    if (rune.procedureCode.includes("DOUBLE")) {
      output = input * 2;
      desc = `DOUBLE: ${input} → ${output}`;
    } else if (rune.procedureCode.includes("HALVE")) {
      output = input / 2;
      desc = `HALVE: ${input} → ${output}`;
    } else if (rune.procedureCode.includes("UNIT_FRACTION")) {
      const match = rune.procedureCode.match(/UNIT_FRACTION\((\d+)\)/);
      const n = match ? parseInt(match[1]) : 2;
      output = input / n;
      desc = `UNIT_FRACTION(${n}): ${input} → ${output}`;
    } else if (rune.procedureCode.includes("SCALE_60")) {
      output = input * rune.sumerianResonance;
      desc = `SCALE_60(${rune.sumerianResonance}): ${input} → ${output}`;
    } else if (rune.procedureCode.includes("ASE_AMPLIFY")) {
      output = input * (1 + rune.aseVitality);
      desc = `ASE_AMPLIFY: input=${input} ase=${rune.aseVitality} → ${output}`;
    } else if (rune.procedureCode.includes("MAAT_BALANCE")) {
      output = input * rune.maatBalance;
      desc = `MAAT_BALANCE: input=${input} maat=${rune.maatBalance} → ${output}`;
    } else {
      output = input * rune.aseVitality;
      desc = `PROPAGATE: input=${input} ase=${rune.aseVitality} → ${output}`;
    }

    const deviation = Math.abs(output - input) / Math.max(Math.abs(input), 1);
    if (deviation > (1 - rune.maatBalance)) {
      output = output * rune.maatBalance + input * (1 - rune.maatBalance);
      desc += ` [Maat corrected → ${output.toFixed(4)}]`;
    }

    maatTotal += rune.maatBalance;
    value = output;

    steps.push({
      stepIndex: i,
      runeId: rune.id,
      runeName: rune.name,
      glyphSymbol: rune.glyphSymbol,
      input,
      output,
      description: desc,
    });
  }

  const duration = Date.now() - start;
  const maatScore = runes.length > 0 ? maatTotal / runes.length : 1;

  res.json({
    programId: id,
    steps,
    finalOutput: value,
    maatScore,
    duration,
  });
});

function programToApi(prog: typeof programsTable.$inferSelect) {
  return {
    ...prog,
    runeIds: (prog.runeIds as number[]) ?? [],
  };
}

export default router;
