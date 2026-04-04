import { Router, type IRouter } from "express";
import healthRouter from "./health";
import runesRouter from "./runes";
import programsRouter from "./programs";
import glyphsRouter from "./glyphs";
import numerologyRouter from "./numerology";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/runes", runesRouter);
router.use("/programs", programsRouter);
router.use("/glyphs", glyphsRouter);
router.use("/numerology", numerologyRouter);
router.use("/stats", statsRouter);

export default router;
