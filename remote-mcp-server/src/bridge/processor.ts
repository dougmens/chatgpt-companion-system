import fs from "node:fs/promises";
import path from "node:path";
import { logEvent } from "./logger.js";

const ALLOWED = [
  "UPDATE_DASHBOARD_DATA",
  "SHOW_DASHBOARD",
  "FOCUS_ENTITY",
  "PLAN_WORKFLOW"
];

const PROCESSED_DIR = path.join(process.cwd(), "companion-bridge", "processed");

export async function processIntentFile(filepath: string): Promise<void> {
  try {
    const content = await fs.readFile(filepath, "utf8");
    let data: any;

    try {
      data = JSON.parse(content);
    } catch {
      await logEvent(`INVALID_JSON | file=${filepath}`);
      await moveFile(filepath, "invalid-json");
      return;
    }

    const intent = data?.intent;
    const domain = data?.domain ?? data?.payload?.domain ?? "-";

    if (!intent || !ALLOWED.includes(intent)) {
      await logEvent(`INVALID_INTENT | intent=${String(intent)} | domain=${domain} | file=${filepath}`);
      await moveFile(filepath, "invalid-intent");
      return;
    }

    await logEvent(`OK | intent=${intent} | domain=${domain} | file=${filepath}`);
    await moveFile(filepath, "ok");
  } catch (err: any) {
    await logEvent(`ERROR | file=${filepath} | msg=${err?.message ?? "unknown"}`);
  }
}

async function moveFile(src: string, tag: string): Promise<void> {
  const base = path.basename(src);
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const dest = path.join(PROCESSED_DIR, `${ts}-${tag}-${base}`);

  await fs.mkdir(PROCESSED_DIR, { recursive: true });
  await fs.rename(src, dest);
}
