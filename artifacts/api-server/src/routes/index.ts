import { Router, type IRouter } from "express";
import healthRouter from "./health";
import runesRouter from "./runes";
import programsRouter from "./programs";
import glyphsRouter from "./glyphs";
import numerologyRouter from "./numerology";
import dictionaryRouter from "./dictionary";
import corpusRouter from "./corpus";
import iconographyRouter from "./iconography";
import pnwArtRouter from "./pnwart";
import statsRouter from "./stats";
import seedRouter from "./seed";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/runes", runesRouter);
router.use("/programs", programsRouter);
router.use("/glyphs", glyphsRouter);
router.use("/numerology", numerologyRouter);
router.use("/dictionary", dictionaryRouter);
router.use("/corpus", corpusRouter);
router.use("/iconography", iconographyRouter);
router.use("/pnw-art", pnwArtRouter);
router.use("/stats", statsRouter);
router.use("/seed", seedRouter);

export default router;
