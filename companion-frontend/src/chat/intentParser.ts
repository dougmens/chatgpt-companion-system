export type Intent =
  | { type: "SHOW_DASHBOARD"; id: "recht" }
  | { type: "NONE" };

const normalize = (text: string) =>
  text.trim().toLowerCase().replace(/\s+/g, " ");

export function parseIntent(message: string): Intent {
  const normalized = normalize(message);
  if (normalized.includes("zeige mir das dashboard recht")) {
    return { type: "SHOW_DASHBOARD", id: "recht" };
  }
  return { type: "NONE" };
}
