// src/server.ts
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import express, { Request, Response } from "express";
import { handleIntent, type MCPRequest } from "./mcp/registry";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

app.use(express.json({ limit: "1mb" }));

// ---------- Health ----------
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    service: "remote-mcp-server",
    ts: new Date().toISOString(),
  });
});

// ---------- MCP Intent Endpoint ----------
app.post("/mcp/intent", (req: Request, res: Response) => {
  const body = (req.body ?? {}) as Partial<MCPRequest>;

  // zentrales Logging (wichtig für Governance)
  console.log("📥 MCP INTENT RECEIVED", {
    intent: body.intent,
    hasPayload: body.payload !== undefined,
    ts: new Date().toISOString(),
  });

  const response = handleIntent({
    intent: (body.intent ?? "").toString(),
    payload: body.payload,
  });

  // 400 bei formalen Fehlern, sonst 200 (auch bei unknown intent)
  if (!response.ok && response.error?.toLowerCase().includes("missing intent")) {
    return res.status(400).json(response);
  }
  return res.status(200).json(response);
});

// ---------- Fallback ----------
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    error: "Endpoint not found",
    ts: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Remote MCP Server listening on port ${PORT}`);
});
