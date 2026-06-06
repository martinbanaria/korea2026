# Korea · June 2026 🇰🇷

A single-file, mobile-first trip itinerary app for an 8-day Seoul → Busan trip
(7–14 June 2026), built around a BTS concert at Busan Asiad Stadium.

## Features

- **8-day schedule** with timed stops, themes, and per-day city tags
- **Live "today" view** — auto-detects the current trip day, shows the next
  item and a progress bar
- **Concert countdown** to the Busan Asiad show
- **Check-offs** for every stop, **persisted on-device** via `localStorage`
- **Google Maps deep links** on every location
- **Stays** summary (Seoul + Busan hotels / Airbnb)

It's a static `index.html` plus one serverless function (`api/checks.js`) for
shared sync — no build step, no npm dependencies, and it still works offline.

## Storage — shared across devices

Check-offs sync across every device viewing the site, so both phones see the
same progress in near real-time.

- **Backend:** a serverless function at [`api/checks.js`](api/checks.js) reads
  and writes a single shared map in Redis over its REST API.
- **Frontend:** `localStorage` (key `korea2026:checks`, versioned envelope
  `{ v: 1, checks: {…} }`) stays as the instant offline cache. On load the app
  unions local state into the store, then polls every 12s (and on tab focus)
  for the other device's changes. A status line in the footer shows
  *Synced across devices* / *Offline · saved locally* / *On this device*.
- **Graceful fallback:** if the store isn't configured (`/api/checks` returns
  `503`) or the network is down, the app silently runs local-only and nothing
  breaks.

### Provisioning the store (one-time)

The function accepts either Vercel KV **or** Upstash Redis env vars:

| Vercel KV          | Upstash Redis              |
| ------------------ | -------------------------- |
| `KV_REST_API_URL`  | `UPSTASH_REDIS_REST_URL`   |
| `KV_REST_API_TOKEN`| `UPSTASH_REDIS_REST_TOKEN` |

In the Vercel dashboard: **Project → Storage → Create / Connect** a Redis
(Upstash) store and attach it to the project. Vercel injects the env vars
automatically; redeploy and sync turns on. Until then the app stays in
local-only mode.

## Run locally

Just open `index.html`, or serve it:

```bash
npx serve .
```

## Deploy to Vercel

This repo is configured for Vercel's zero-build static hosting (`vercel.json`).

### Option A — connect the GitHub repo (recommended, auto-deploys)

1. Go to <https://vercel.com/new>
2. **Import** `martinbanaria/korea2026`
3. Framework preset: **Other** · Build command: *(none)* · Output dir: `./`
4. Deploy.

Every push to the repo then redeploys automatically. To make this branch the
live site, either merge it to `main`, or set it as the Production Branch in
**Project → Settings → Git**.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel        # preview deploy
vercel --prod # production deploy
```
