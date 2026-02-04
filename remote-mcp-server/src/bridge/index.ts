import chokidar from "chokidar";
import path from "node:path";
import fs from "node:fs/promises";
import { processIntentFile } from "./processor.js";
import { logEvent } from "./logger.js";

const ROOT = path.join(process.cwd(), "companion-bridge");
const INBOX = path.join(ROOT, "inbox");

async function ensureDirs() {
  await fs.mkdir(path.join(ROOT, "inbox"), { recursive: true });
  await fs.mkdir(path.join(ROOT, "processed"), { recursive: true });
  await fs.mkdir(path.join(ROOT, "logs"), { recursive: true });
  await fs.mkdir(path.join(ROOT, "data"), { recursive: true });
}

await ensureDirs();
await logEvent("WATCHER_START");

console.log(`[bridge] watching: ${INBOX}`);

const watcher = chokidar.watch(INBOX, {
  persistent: true,
  ignoreInitial: false,
  ignored: /(^|[\/\\])\../,
  awaitWriteFinish: { stabilityThreshold: 400, pollInterval: 100 }
});

watcher
  .on("add", (p) => {
    if (!p.endsWith(".json")) return;
    void processIntentFile(p);
  })
  .on("error", async (err) => {
    await logEvent(`WATCHER_ERROR | msg=${String(err)}`);
  });

process.on("SIGINT", () => {
  watcher.close();
  console.log("[bridge] stopped");
  process.exit(0);
});
