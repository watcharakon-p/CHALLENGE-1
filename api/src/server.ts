import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { devSeed } from "./routes/dev.seed.route";
import { sseHandler } from "./rt/sse";

export function createServer() {
  const app = express();
  app.set("etag", "strong");
  app.use(helmet());
  app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("tiny"));

  const limiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
    max: Number(process.env.RATE_LIMIT_MAX || 200),
  });

  app.get("/rt/sse", sseHandler);
  app.use(devSeed);


  app.get("/health", (_req, res) => res.json({ ok: true }));
  
  app.use((_, res) => res.status(404).json({ ok: false, error: "Not Found" }));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _req: any, res: any, _next: any) =>
    res.status(500).json({ ok: false, error: "Internal Error" })
  );
  
  return app;
}
