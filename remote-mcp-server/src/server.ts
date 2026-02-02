// src/server.ts

import express from "express";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "remote-mcp-server",
    ts: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Remote MCP Server listening on port ${PORT}`);
});
