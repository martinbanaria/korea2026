// Shared check-off state for the Korea 2026 itinerary.
//
// Stores a single shared map { "<itemId>": true, ... } so every device sees the
// same progress. Backed by Redis over its REST API — works with a Vercel KV
// store or an Upstash Redis integration (either set of env vars is accepted).
//
//   GET  /api/checks            -> { checks: {...}, updatedAt: <ms> }
//   POST /api/checks            -> body { id, value } | { checks: {...} }
//                                  merges, then returns { checks, updatedAt }
//
// If no store is configured the endpoint returns 503 and the client falls back
// to local-only (localStorage) mode, so the app keeps working either way.

const KEY = "korea2026:checks";
const META = "korea2026:checks:updatedAt";

function creds() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return { url, token };
}

async function redis(command) {
  const { url, token } = creds();
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  if (!r.ok) throw new Error(`redis ${r.status}`);
  const json = await r.json();
  if (json.error) throw new Error(json.error);
  return json.result;
}

async function readState() {
  const [raw, ts] = await Promise.all([redis(["GET", KEY]), redis(["GET", META])]);
  let checks = {};
  try { if (raw) checks = JSON.parse(raw); } catch { checks = {}; }
  return { checks, updatedAt: ts ? Number(ts) : 0 };
}

async function writeState(checks) {
  const updatedAt = Date.now();
  await redis(["SET", KEY, JSON.stringify(checks)]);
  await redis(["SET", META, String(updatedAt)]);
  return { checks, updatedAt };
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  let data = "";
  for await (const chunk of req) data += chunk;
  if (!data) return {};
  try { return JSON.parse(data); } catch { return {}; }
}

export default async function handler(req, res) {
  const { url, token } = creds();
  if (!url || !token) {
    res.status(503).json({ error: "storage_not_configured" });
    return;
  }

  try {
    if (req.method === "GET") {
      const state = await readState();
      res.setHeader("Cache-Control", "no-store");
      res.status(200).json(state);
      return;
    }

    if (req.method === "POST") {
      const body = await readBody(req);
      const current = await readState();
      let next;

      if (body && body.reset === true) {
        // Clear all shared check-offs.
        next = {};
      } else if (body && typeof body.checks === "object" && body.checks !== null) {
        // Full replace/merge: union of server + client truthy keys.
        next = { ...current.checks };
        for (const [k, v] of Object.entries(body.checks)) {
          if (v) next[k] = true; else delete next[k];
        }
      } else if (body && typeof body.id === "string") {
        // Single-item toggle: merge into the latest server state to avoid one
        // device clobbering the other's recent change.
        next = { ...current.checks };
        if (body.value) next[body.id] = true; else delete next[body.id];
      } else {
        res.status(400).json({ error: "bad_request" });
        return;
      }

      const saved = await writeState(next);
      res.status(200).json(saved);
      return;
    }

    res.setHeader("Allow", "GET, POST");
    res.status(405).json({ error: "method_not_allowed" });
  } catch (err) {
    res.status(502).json({ error: "storage_error", detail: String(err.message || err) });
  }
}
