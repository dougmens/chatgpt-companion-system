// src/mcp/registry.ts
export type MCPRequest = {
  intent: string;
  payload?: unknown;
};

export type MCPResult = {
  ok: boolean;
  handled: boolean;
  intent: string;
  result?: unknown;
};

function dashboardUrl(): string {
  return (process.env.DASHBOARD_URL || "https://dougmens.github.io/chatgpt-companion-system/").trim();
}

export async function handleIntent(req: MCPRequest): Promise<MCPResult> {
  const intent = req.intent;

  if (intent === "SHOW_DASHBOARD") {
    return {
      ok: true,
      handled: true,
      intent,
      result: {
        url: dashboardUrl(),
        note: "Dashboard is external; open this URL in a browser."
      }
    };
  }

  if (intent === "LIST_CAPABILITIES") {
    return {
      ok: true,
      handled: true,
      intent,
      result: {
        server: { name: "remote-mcp-server", version: "0.1.0", mode: "read-only" },
        intents: [
          { name: "PING", description: "Liveness test" },
          { name: "ECHO", description: "Echo payload for wiring/debug" },
          { name: "LIST_CAPABILITIES", description: "List supported intents and server info" },
          { name: "SHOW_DASHBOARD", description: "Return dashboard link(s) – no UI rendered here" },
          { name: "UPDATE_DASHBOARD_DATA", description: "Accept dashboard update events – read-only phase: log + ack only" }
        ],
        policies: {
          read_only: true,
          notes: ["No file system writes", "No destructive operations", "All requests are logged"]
        }
      }
    };
  }

  if (intent === "UPDATE_DASHBOARD_DATA") {
    return {
      ok: true,
      handled: true,
      intent,
      result: {
        note: "Update received (read-only)."
      }
    };
  }

  // Default stub
  return {
    ok: true,
    handled: true,
    intent,
    result: { note: "Intent received and accepted (MVP)." }
  };
}
