import { useEffect, useMemo, useState } from "react";

type McpStatusState = "online" | "offline" | "unknown";

type StatusPayload = {
  status?: McpStatusState;
  timestamp?: string;
  ok?: boolean;
};

const STATUS_URL = "http://localhost:3333/mcp-status";
const HEALTH_URL = "http://localhost:3333/health";
const POLL_MS = 60_000;

const normalizeStatus = (payload?: StatusPayload): McpStatusState => {
  if (!payload) return "unknown";
  if (payload.status === "online" || payload.status === "offline") return payload.status;
  if (payload.ok === true) return "online";
  return "unknown";
};

export function McpStatus() {
  const [status, setStatus] = useState<McpStatusState>("unknown");
  const [timestamp, setTimestamp] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const poll = async () => {
      try {
        const res = await fetch(STATUS_URL, { cache: "no-store" });
        if (res.ok) {
          const json = (await res.json()) as StatusPayload;
          if (!alive) return;
          setStatus(normalizeStatus(json));
          setTimestamp(json.timestamp ?? null);
          return;
        }
      } catch {
        // ignore
      }

      try {
        const res = await fetch(HEALTH_URL, { cache: "no-store" });
        if (!alive) return;
        if (res.ok) {
          const json = (await res.json()) as StatusPayload;
          setStatus(normalizeStatus(json));
          setTimestamp(null);
          return;
        }
      } catch {
        // ignore
      }

      if (alive) {
        setStatus("offline");
        setTimestamp(null);
      }
    };

    poll();
    const timer = window.setInterval(poll, POLL_MS);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, []);

  const label = useMemo(() => {
    if (status === "online") return "Online";
    if (status === "offline") return "Offline";
    return "Unbekannt";
  }, [status]);

  const badgeClass = useMemo(() => {
    if (status === "online") return "border-emerald-500/40 bg-emerald-500/15 text-emerald-300";
    if (status === "offline") return "border-rose-500/40 bg-rose-500/15 text-rose-300";
    return "border-amber-500/40 bg-amber-500/15 text-amber-300";
  }, [status]);

  const formattedTime = useMemo(() => {
    if (!timestamp) return null;
    try {
      return new Date(timestamp).toLocaleString("de-DE");
    } catch {
      return timestamp;
    }
  }, [timestamp]);

  return (
    <div className="flex items-center gap-3">
      <div className={`rounded-full border px-2 py-1 text-xs font-semibold ${badgeClass}`}>
        MCP: {label}
      </div>
      <span className="text-[11px] text-slate-400">
        {formattedTime ? `Update: ${formattedTime}` : "Status wird ueberprueft..."}
      </span>
    </div>
  );
}
