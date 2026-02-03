import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { handleIntent, type MCPRequest } from "./mcp/registry";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

/* --------------------------------------------------
   Logging + JSON
-------------------------------------------------- */

app.use(morgan("combined"));
app.use(express.json({ limit: "1mb" }));

/* --------------------------------------------------
   Health (öffentlich)
-------------------------------------------------- */

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    service: "remote-mcp-server",
    ts: new Date().toISOString(),
  });
});

/* --------------------------------------------------
   Rate Limiting
-------------------------------------------------- */

const mcpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Rate limit exceeded" },
});

app.use("/mcp", mcpLimiter);

/* --------------------------------------------------
   API Key Schutz
-------------------------------------------------- */

function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const key = req.header("X-API-Key");

  if (!key || key !== process.env.MCP_API_KEY) {
    return res.status(401).json({
      ok: false,
      error: "Unauthorized",
    });
  }

  next();
}

app.use("/mcp", requireApiKey);

/* --------------------------------------------------
   MCP Intent Endpoint
-------------------------------------------------- */

app.post("/mcp/intent", async (req: Request, res: Response) => {
  const body = req.body as MCPRequest;

  console.log("📥 MCP INTENT RECEIVED", {
    intent: body.intent,
    hasPayload: body.payload !== undefined,
    ts: new Date().toISOString(),
  });

  try {
    const result = await handleIntent(body);

    res.json({
      ok: true,
      handled: true,
      intent: body.intent,
      service: "remote-mcp-server",
      ts: new Date().toISOString(),
      result,
    });
  } catch (err: any) {
    console.error("❌ MCP ERROR", err);

    res.status(500).json({
      ok: false,
      error: err?.message ?? "Unknown MCP error",
    });
  }
});

/* --------------------------------------------------
   Start
-------------------------------------------------- */

app.listen(PORT, () => {
  console.log(`🚀 Remote MCP Server running on port ${PORT}`);
});
