import path from "node:path";
import { existsSync } from "node:fs";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const REFERENCE_CODEX_PATH = path.join(
  __dirname,
  "assets",
  "Hiero-Code_Reference_Codex.pdf",
);

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/reference-codex.pdf", (req, res) => {
  if (!existsSync(REFERENCE_CODEX_PATH)) {
    req.log.error(
      { path: REFERENCE_CODEX_PATH },
      "Reference codex PDF not found on disk",
    );
    res.status(404).json({ error: "Reference codex PDF is not available" });
    return;
  }
  res.download(REFERENCE_CODEX_PATH, "Hiero-Code_Reference_Codex.pdf");
});

app.use("/api", router);

export default app;
