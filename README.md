# Korea · June 2026 🇰🇷

A single-file, mobile-first trip itinerary app for an 8-day Seoul → Busan trip
(7–14 June 2026), built around a BTS concert at Busan Asiad Stadium.

## Features

- **8-day schedule** with timed stops, themes, and per-day city tags
- **Live "today" view** — auto-detects the current trip day, shows the next
  item and a progress bar
- **Concert countdown** to the Busan Asiad show
- **Check-offs** for every stop, **persisted on-device** via `localStorage`
- **Full editing** — tap the ✎ button to add / edit / delete / reorder items,
  add section headings, edit day details, and add or remove whole days. Each
  item carries a **stable id**, so reordering never disturbs your check-offs.
- **Naver Map deep links** on every location (better for Korea than Google Maps)
- **Expandable AI suggestions** per day — curated things to do in each city,
  each addable to the itinerary with one tap
- **Camera / photos** — snap a picture per day; saved to **IndexedDB** with a
  full-screen viewer and delete. Images are downscaled (max 1280px) before
  storage.
- **Stays** summary (Seoul + Busan hotels / Airbnb)

It's a static `index.html` plus one serverless function (`api/checks.js`) for
optional shared check-off sync — no build step, no npm dependencies, works
offline.

### Where data lives

On static hosting (GitHub Pages) everything is **device-local**: itinerary
edits → `localStorage` (`korea2026:trip`), check-offs → `localStorage`
(`korea2026:checks`), photos → IndexedDB (`korea2026-photos`). The seed
itinerary ships in the page; your first edit forks a saved copy in
`localStorage`. The suggestions are hand-curated and embedded (a live model
call would expose an API key on a public static page).

To make edits/photos/check-offs **shared between phones**, a backend is needed
(the included `api/checks.js` covers check-offs on Vercel; full edit/photo sync
would want something like Firebase, which also works from a static page).

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
