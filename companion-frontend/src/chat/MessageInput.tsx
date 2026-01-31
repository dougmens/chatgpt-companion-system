import { useState } from "react";
import { parseIntent } from "./intentParser";
import { handleDashboardIntent } from "../dashboard/router";
import { useCompanionStore } from "../state/companionStore";

export async function callMCP(tool: string, payload: any) {
  const response = await fetch("http://localhost:3333/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tool, payload }),
  });
  return response.json();
}

export function MessageInput() {
  const [value, setValue] = useState("");
  const addMessage = useCompanionStore((state) => state.addMessage);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    addMessage({
      id: `msg-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    });

    if (trimmed.startsWith("/mcp ")) {
      const parts = trimmed.slice(5).trim().split(" ");
      const tool = parts[0];
      const rawPayload = parts.slice(1).join(" ").trim();
      let payload: any = {};
      if (rawPayload) {
        try {
          payload = JSON.parse(rawPayload);
        } catch {
          payload = { raw: rawPayload };
        }
      }

      callMCP(tool, payload)
        .then((result) => {
          addMessage({
            id: `msg-${Date.now()}-mcp`,
            role: "assistant",
            content: JSON.stringify(result, null, 2),
            createdAt: Date.now(),
          });
        })
        .catch((error) => {
          addMessage({
            id: `msg-${Date.now()}-mcp-error`,
            role: "assistant",
            content: `MCP Fehler: ${String(error)}`,
            createdAt: Date.now(),
          });
        });
    } else {
      const intent = parseIntent(trimmed);
      if (intent.type === "SHOW_DASHBOARD") {
        addMessage({
          id: `msg-${Date.now()}-system`,
          role: "assistant",
          content: "Dashboard wird geöffnet...",
          createdAt: Date.now(),
        });
        handleDashboardIntent(intent);
      }
    }

    setValue("");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 border-t border-slate-800 p-3">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Schreibe eine Nachricht..."
        className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
      />
      <button
        onClick={handleSend}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
      >
        Senden
      </button>
    </div>
  );
}
