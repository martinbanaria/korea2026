# PALETA 🎨 — Personal Color Analysis (POC)

A single-file, installable web app (PWA) that brings the **Korean
department-store personal color experience** — like the Colorize studio
analysis in Seoul — to any phone or tablet, packaged for the **Philippine
market** (₱ pricing, PH occasions, morena-inclusive skin tones, GCash/Maya
checkout hooks).

No build step, no dependencies. Open `index.html` or serve the folder; it
works offline after first load (service worker) and installs to the home
screen like a native app.

## The analysis engine

Modeled on the 9-tone Korean system used in the physical Colorize report:

| Stage | What happens |
| --- | --- |
| 📸 Photo | Selfie (front camera) or upload; tap 3 bare-skin points (or auto-detect). Samples are averaged and converted **sRGB → XYZ → CIELAB**. |
| 📝 Quiz | 6 questions (vein color, jewelry, sun reaction, hair, vivid-color response, white vs cream) — each contributes weighted tone/depth/clarity/contrast scores. |
| 🪞 Virtual draping | 4 A/B drape rounds with the user's own face crop on the drape color — the digital version of the fabric drapes used in-studio. |
| 🧮 Classification | Hue angle → warm/cool undertone (yellow/neutral/blue base), L\* → depth, chroma + quiz → clarity, mapped onto the 9 tones: Spring Light/Bright, Summer Light/Mute/Bright, Autumn Mute/Deep, Winter Bright/Deep. |

The output replicates the studio report: best palette (14 swatches), main
colors, basics, skin base + named skin tone (e.g. *Cameo Rose*), makeup
shades, pattern & accessory guidance, metal, contrast meter, hair colors,
best / second / worst types, and fashion direction points.

**Validated against a real result:** a blue-base "Cameo Rose" skin sample
with cool/clear/high-contrast quiz answers classifies as **Summer Bright**
— matching the in-person Colorize analysis that inspired this POC.

## Features

- **Full report** — Colorize-style layout, share-card generator (canvas →
  1080×1350 PNG → Web Share API / download) for IG & TikTok
- **Lookbook** — outfit formulas rendered in *your* palette, grouped by PH
  occasions (office, beach, wedding guest, barkada, brunch…), save ♥
- **Look guides** — capsule wardrobe, do/don't, beauty cheat sheet per tone
- **Outfit planner** — 7-day week, slot-based outfit builder restricted to
  your palette, one-tap **"✨ Plan my week"** auto-styling
- **Marketplace layer** — demo PH brands with live **palette-match scores**
  (ΔE against your palette), category filters, bag + demo checkout
- **Community** — color-twins feed mock with cross-posting hooks
- **AI Stylist** — chat that answers in your palette (POC rulebook;
  production slot for the Claude API)
- **Onboarding** — 5-slide first-run tour + one-time contextual nudges per
  tab, replayable from Profile
- **PWA** — manifest, service worker, offline, installable

## AI roadmap (the differentiators)

Shown in-app on Home: live AI mirror draping, closet scan, OOTD autopilot
(weather + calendar), PH shade translator (Ever Bilena / BLK / Sunnies Face
shade matching), Barkada Mode group analysis for weddings & debuts, tone
drift tracking across the year, palette-aware shopping feeds
(Lazada/Shopee/TikTok Shop APIs).

## Run

```bash
npx serve .   # or just open index.html
```

Camera capture requires HTTPS (or localhost) — GitHub Pages / Vercel both
qualify. Everything is stored on-device in `localStorage`
(`paleta:*` keys); no data leaves the phone in this POC.
