// src/server.ts
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createRemoteJWKSet, jwtVerify, JWTPayload } from "jose";
import { Provider, KoaContextWithOIDC } from "oidc-provider";

import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { handleIntent, type MCPRequest } from "./mcp/registry.js";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || "").trim();
const OAUTH_ISSUER = (process.env.OAUTH_ISSUER || "").trim();
const RESOURCE = (process.env.RESOURCE || "").trim();
const SESSION_SECRET = (process.env.SESSION_SECRET || "").trim();
const OAUTH_SCOPE = (process.env.OAUTH_SCOPE || "mcp:invoke").trim();

const TRUST_PROXY = (process.env.TRUST_PROXY || "true").toLowerCase() === "true";
if (TRUST_PROXY) app.set("trust proxy", 1);

function requireEnv(name: string, value: string) {
  if (!value) throw new Error(`Missing required env var ${name}. Set it in Render -> Environment.`);
}

requireEnv("PUBLIC_BASE_URL", PUBLIC_BASE_URL);
requireEnv("OAUTH_ISSUER", OAUTH_ISSUER);
requireEnv("RESOURCE", RESOURCE);
requireEnv("SESSION_SECRET", SESSION_SECRET);

// --------------------
// Bridge paths (file-based inbox)
// --------------------
const BRIDGE_ROOT = path.join(process.cwd(), "companion-bridge");
const BRIDGE_INBOX = path.join(BRIDGE_ROOT, "inbox");
const BRIDGE_PROCESSED = path.join(BRIDGE_ROOT, "processed");
const BRIDGE_LOGS = path.join(BRIDGE_ROOT, "logs");
const BRIDGE_DATA = path.join(BRIDGE_ROOT, "data");

async function ensureBridgeDirs() {
  await fs.mkdir(BRIDGE_INBOX, { recursive: true });
  await fs.mkdir(BRIDGE_PROCESSED, { recursive: true });
  await fs.mkdir(BRIDGE_LOGS, { recursive: true });
  await fs.mkdir(BRIDGE_DATA, { recursive: true });
}

function safeIsoForFilename(d: Date) {
  return d.toISOString().replace(/[:.]/g, "-");
}

async function enqueueIntentToInbox(request: MCPRequest, authSub?: string) {
  await ensureBridgeDirs();

  const now = new Date();
  const intentId = `I-${safeIsoForFilename(now)}-${randomUUID()}`;

  const envelope = {
    intentId,
    received_at: now.toISOString(),
    auth: authSub ? { sub: authSub } : undefined,
    ...request
  };

  const filename = `${intentId}.json`;
  const filePath = path.join(BRIDGE_INBOX, filename);

  await fs.writeFile(filePath, JSON.stringify(envelope, null, 2), "utf8");

  return { intentId, filename, filePath };
}

// Body + logging
app.use(express.json({ limit: "1mb" }));
app.use(morgan("combined"));

// Basic rate limit (public endpoints)
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false
  })
);

// --------------------
// Health
// --------------------
app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "remote-mcp-server", ts: new Date().toISOString() });
});

// ======================================================
// 1) Protected Resource Metadata (RFC 9728 / MCP requirement)
// ======================================================
app.get("/.well-known/oauth-protected-resource", (_req: Request, res: Response) => {
  res.json({
    resource: RESOURCE,
    authorization_servers: [OAUTH_ISSUER],
    scopes_supported: [OAUTH_SCOPE],
    resource_documentation: `${PUBLIC_BASE_URL}/docs`
  });
});

// Optional docs placeholder
app.get("/docs", (_req: Request, res: Response) => {
  res.type("text/plain").send(
    [
      "Companion MCP Server",
      "",
      "OAuth-protected resource metadata:",
      `  ${PUBLIC_BASE_URL}/.well-known/oauth-protected-resource`,
      "",
      "OAuth issuer (discovery):",
      `  ${OAUTH_ISSUER}/.well-known/openid-configuration`,
      "",
      "MCP endpoint:",
      `  ${PUBLIC_BASE_URL}/mcp/intent`,
      ""
    ].join("\n")
  );
});

// ======================================================
// 2) OAuth Authorization Server (OIDC Provider) under /oauth
// ======================================================
const oidc = new Provider(OAUTH_ISSUER, {
  pkce: {
    methods: ["S256"],
    required: () => true
  },

  findAccount: async (_ctx: KoaContextWithOIDC, id: string) => {
    if (id === "user") {
      return {
        accountId: "user",
        async claims() {
          return { sub: "user", email: "user@example.com" };
        }
      };
    }
    return undefined;
  },

  clients: [],

  cookies: {
    keys: [SESSION_SECRET]
  },

  scopes: ["openid", "email", OAUTH_SCOPE],

  features: {
    registration: { enabled: true },

    resourceIndicators: {
      enabled: true,
      getResourceServerInfo: async (_ctx: KoaContextWithOIDC, resource: string) => {
        if (resource !== RESOURCE) return undefined;
        return {
          scope: OAUTH_SCOPE,
          audience: RESOURCE,
          accessTokenTTL: 60 * 60
        };
      },
      defaultResource: () => RESOURCE,
      useGrantedResource: true
    }
    // devInteractions NICHT überschreiben (lokal ok)
  },

  formats: {
    AccessToken: "jwt"
  },

  extraClientMetadata: {
    properties: ["redirect_uris"],
    validator: (key: string, value: unknown) => {
      if (key !== "redirect_uris") return;

      if (!Array.isArray(value) || value.length === 0) {
        throw new Error("redirect_uris must be a non-empty array");
      }

      const allowed = new Set<string>([
        "https://chatgpt.com/connector_platform_oauth_redirect",
        "https://platform.openai.com/apps-manage/oauth",
        "http://localhost:3333/oauth/callback"
      ]);

      for (const uri of value) {
        if (!allowed.has(uri)) throw new Error(`redirect_uri not allowed: ${uri}`);
      }
    }
  }
});

// Dummy callback page for local test (shows code)
app.get("/oauth/callback", (req, res) => {
  res.type("text/plain").send(
    [
      "OAuth callback received.",
      `code=${String(req.query.code || "")}`,
      `state=${String(req.query.state || "")}`
    ].join("\n")
  );
});

// Mount oidc-provider under /oauth
app.use("/oauth", oidc.callback());

// ======================================================
// 3) Bearer Token Verification Middleware for MCP endpoints
// ======================================================
const jwks = createRemoteJWKSet(new URL(`${OAUTH_ISSUER}/jwks`));

type AuthContext = {
  sub: string;
  scope?: string;
  aud?: string | string[];
  iss?: string;
};

function wwwAuthHeader(requiredScope: string) {
  return `Bearer resource_metadata="${PUBLIC_BASE_URL}/.well-known/oauth-protected-resource", scope="${requiredScope}"`;
}

// --------------------
// UPDATED: requireBearer with safe diagnostics + explicit MCP_API_KEY missing
// --------------------
async function requireBearer(req: Request, res: Response, next: NextFunction) {
  const auth = req.header("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length).trim() : "";

  const allowApiKeyFallback =
    (process.env.ALLOW_API_KEY_FALLBACK || "false").toLowerCase() === "true";

  const apiKey = (req.header("x-api-key") || "").trim();
  const mcpApiKey = (process.env.MCP_API_KEY || "").trim();

  // Fast path: legacy API-key fallback
  if (!token && allowApiKeyFallback) {
    if (apiKey && mcpApiKey && apiKey === mcpApiKey) {
      (req as any).auth = {
        sub: "apikey-client",
        scope: OAUTH_SCOPE,
        aud: RESOURCE,
        iss: OAUTH_ISSUER
      } satisfies AuthContext;
      return next();
    }
  }

  // Diagnostics headers (no secrets) — helps detect Render ENV drift quickly
  res.setHeader("x-auth-fallback", String(allowApiKeyFallback));
  res.setHeader("x-auth-has-mcp-api-key", String(Boolean(mcpApiKey)));
  res.setHeader("x-auth-has-x-api-key", String(Boolean(apiKey)));
  res.setHeader("x-auth-has-bearer", String(Boolean(token)));

  // If server has no MCP_API_KEY configured at all, make this explicit (still safe)
  // (In your flow this is common when Render ENV isn't active after a deploy)
  if (!mcpApiKey && !token && apiKey) {
    return res.status(500).json({ ok: false, error: "Server misconfigured: MCP_API_KEY missing" });
  }

  // If no bearer token, normal MCP/OAuth response
  if (!token) {
    res.setHeader("WWW-Authenticate", wwwAuthHeader(OAUTH_SCOPE));
    return res.status(401).json({ ok: false, error: "missing_bearer_token" });
  }

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: OAUTH_ISSUER,
      audience: RESOURCE
    });

    const jwt = payload as JWTPayload & { scope?: string };

    const scope = typeof jwt.scope === "string" ? jwt.scope : undefined;
    if (!scope || !scope.split(" ").includes(OAUTH_SCOPE)) {
      res.setHeader("WWW-Authenticate", wwwAuthHeader(OAUTH_SCOPE));
      return res.status(403).json({ ok: false, error: "insufficient_scope" });
    }

    (req as any).auth = {
      sub: String(jwt.sub || ""),
      scope,
      aud: jwt.aud,
      iss: jwt.iss
    } satisfies AuthContext;

    return next();
  } catch {
    res.setHeader("WWW-Authenticate", wwwAuthHeader(OAUTH_SCOPE));
    return res.status(401).json({ ok: false, error: "invalid_token" });
  }
}

// ======================================================
// 4) MCP Intent Endpoint (protected)
// ======================================================
app.post("/mcp/intent", requireBearer, async (req: Request, res: Response) => {
  const body = (req.body ?? {}) as Partial<MCPRequest>;

  if (!body.intent || typeof body.intent !== "string") {
    return res.status(400).json({ ok: false, error: "missing_intent" });
  }

  const request: MCPRequest = {
    intent: body.intent,
    payload: body.payload
  };

  // 1) Bridge enqueue (file-based)
  const authCtx = (req as any).auth as AuthContext | undefined;
  const { intentId, filename } = await enqueueIntentToInbox(request, authCtx?.sub);

  // 2) Existing in-process handler (keep as-is)
  const result = await handleIntent(request);

  // 3) Return response (200 OK genügt)
  res.json({
    ok: true,
    intentId,
    filename,
    handled: result
  });
});

app.get("/", (_req, res) => {
  res.type("text/plain").send("Companion MCP Server is running.");
});

app.listen(PORT, () => {
  console.log(`✅ Server listening on ${PORT}`);
  console.log(`   Resource: ${RESOURCE}`);
  console.log(`   OAuth Issuer: ${OAUTH_ISSUER}`);
  console.log(`   Bridge inbox: ${BRIDGE_INBOX}`);
});
