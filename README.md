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

It's a static `index.html` — no build step, no dependencies, works offline once
loaded.

## Storage

Check-offs are saved to the browser's `localStorage` under the key
`korea2026:checks`, wrapped in a versioned envelope (`{ v: 1, checks: {…} }`)
so the data survives reloads, relaunches, and offline use. If storage is
blocked (private mode / sandboxed preview), the app falls back to in-memory
state so it never breaks.

> Persistence is **per-device / per-browser**. To sync check-offs across two
> phones you'd need a small backend (e.g. Vercel KV + a serverless route) —
> happy to add that as a follow-up if you want shared state.

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
