import React, { useEffect, useMemo, useState } from 'react';

type McpStatusState = 'online' | 'offline' | 'unknown';

type StatusPayload = {
  status?: McpStatusState;
  timestamp?: string;
  ok?: boolean;
};

const STATUS_URL = 'http://localhost:3333/mcp-status';
const HEALTH_URL = 'http://localhost:3333/health';
const POLL_MS = 60_000;

const normalizeStatus = (payload?: StatusPayload): McpStatusState => {
  if (!payload) return 'unknown';
  if (payload.status === 'online' || payload.status === 'offline') return payload.status;
  if (payload.ok === true) return 'online';
  return 'unknown';
};

export const McpStatus: React.FC = () => {
  const [status, setStatus] = useState<McpStatusState>('unknown');
  const [timestamp, setTimestamp] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const res = await fetch(STATUS_URL, { cache: 'no-store' });
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
        const res = await fetch(HEALTH_URL, { cache: 'no-store' });
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
        setStatus('offline');
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
    if (status === 'online') return 'Online';
    if (status === 'offline') return 'Offline';
    return 'Unbekannt';
  }, [status]);

  const indicator = useMemo(() => {
    if (status === 'online') return '🟢';
    if (status === 'offline') return '🔴';
    return '⚪';
  }, [status]);

  const formattedTime = useMemo(() => {
    if (!timestamp) return null;
    try {
      return new Date(timestamp).toLocaleString('de-DE');
    } catch {
      return timestamp;
    }
  }, [timestamp]);

  return (
    <div className={`mcp-status mcp-status-${status}`}>
      <div className="mcp-status-title">MCP Server</div>
      <div className="mcp-status-value">
        <span>{label}</span>
        <span className="mcp-status-indicator">{indicator}</span>
      </div>
      {formattedTime ? (
        <div className="mcp-status-meta">Letztes Update: {formattedTime}</div>
      ) : (
        <div className="mcp-status-meta">Status wird ueberprueft...</div>
      )}
    </div>
  );
};
