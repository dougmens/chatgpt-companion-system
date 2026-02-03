// src/mcp/registry.ts

export type MCPIntent =
  | "PING"
  | "ECHO"
  | "LIST_CAPABILITIES"
  | "SHOW_DASHBOARD"
  | "UPDATE_DASHBOARD_DATA";

export type MCPRequest = {
  intent: MCPIntent | string; // erlaubt vorerst auch unbekannte Intents (wir antworten dann sauber)
  payload?: unknown;
};

export type MCPResponse = {
  ok: boolean;
  handled: boolean;
  intent?: string;
  service: "remote-mcp-server";
  ts: string;

  // optional
  result?: unknown;
  error?: string;
};

const SERVICE: MCPResponse["service"] = "remote-mcp-server";

function nowISO() {
  return new Date().toISOString();
}

export function listCapabilities() {
  return {
    server: { name: SERVICE, version: "0.1.0", mode: "read-only" },
    intents: [
      { name: "PING", description: "Liveness test" },
      { name: "ECHO", description: "Echo payload for wiring/debug" },
      { name: "LIST_CAPABILITIES", description: "List supported intents and server info" },
      {
        name: "SHOW_DASHBOARD",
        description: "Return dashboard link(s) – no UI rendered here",
      },
      {
        name: "UPDATE_DASHBOARD_DATA",
        description: "Accept dashboard update events – read-only phase: log + ack only",
      },
    ],
    policies: {
      read_only: true,
      notes: [
        "No file system writes",
        "No destructive operations",
        "All requests are logged",
      ],
    },
  };
}

function ok(intent: string, result?: unknown): MCPResponse {
  return {
    ok: true,
    handled: true,
    intent,
    service: SERVICE,
    ts: nowISO(),
    ...(result !== undefined ? { result } : {}),
  };
}

function fail(intent: string | undefined, error: string, statusHandled = false): MCPResponse {
  return {
    ok: false,
    handled: statusHandled,
    intent,
    service: SERVICE,
    ts: nowISO(),
    error,
  };
}

export function handleIntent(req: MCPRequest): MCPResponse {
  const intent = (req?.intent ?? "").toString().trim();
  const payload = req?.payload;

  if (!intent) return fail(undefined, "Missing intent");

  switch (intent) {
    case "PING":
      return ok(intent, { pong: true });

    case "ECHO":
      return ok(intent, { payload });

    case "LIST_CAPABILITIES":
      return ok(intent, listCapabilities());

    case "SHOW_DASHBOARD": {
      // In deiner Architektur: Dashboards sind extern, wir liefern nur Links.
      // Standard-Base-URL (aus deinem Master-Setup):
      const baseUrl = "https://dougmens.github.io/cases";

      // optional: payload kann { path: "fristen" } enthalten
      const path = (payload as any)?.path ? String((payload as any).path) : "";
      const url = path ? `${baseUrl}/${encodeURIComponent(path)}` : baseUrl;

      return ok(intent, {
        url,
        note: "Dashboard is external; open this URL in a browser.",
      });
    }

    case "UPDATE_DASHBOARD_DATA": {
      // Phase-1: read-only = wir nehmen an, loggen, bestätigen.
      // Später: persistieren (DB/VectorStore/Git) oder weiterleiten.
      return ok(intent, {
        accepted: true,
        note: "Read-only phase: logged + acknowledged (no persistence yet).",
      });
    }

    default:
      return fail(intent, `Unknown intent: ${intent}`, false);
  }
}
