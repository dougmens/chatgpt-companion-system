import fs from "node:fs/promises";
import path from "node:path";
import { format } from "date-fns";

const LOG_DIR = path.join(process.cwd(), "companion-bridge", "logs");

export async function logEvent(msg: string): Promise<void> {
  const today = format(new Date(), "yyyy-MM-dd");
  const logfile = path.join(LOG_DIR, `bridge-${today}.log`);
  const line = `${new Date().toISOString()} | ${msg}\n`;

  await fs.mkdir(LOG_DIR, { recursive: true });
  await fs.appendFile(logfile, line, "utf8");
}
