# Efasa starter (E-State Fusions AI Search Agent)

A minimal Vite + React starter that bakes in Efasa’s identity, consent notice, learning core stub, and marketing tools placeholder. It is scoped to a **multi-source, province-wide crawler** (not a single-site scraper) with explicit consent for interaction logging.

## Scope at a glance
- Province-wide coverage for Quebec with modular sources (direct-owner classifieds, login portals, humanity-AI registries).
- Command-only posture: nothing runs until the user clicks/approves.
- Transparent data stance: interaction logs belong to the operator; no personal client data is collected unless entered.

### Module map
| Module | Purpose |
| --- | --- |
| `src/modules/crawler-direct-owner.js` | Stubs for public/direct-owner sources (Kijiji, LesPAC, Craigslist, forums). |
| `src/modules/crawler-login-portals.js` | Stubs for authenticated portals (e.g., DuProprio, semi-private marketplaces). |
| `src/modules/crawler-humanity-ai.js` | Stubs for landline/registry checks aligned with the Humanity AI concept. |
| `src/modules/filters.js` | Central place to filter/flag results (e.g., highlight super deals, hide brokers). |
| `src/modules/learning-core.js` | Logs interaction events you own; wire to storage of your choice. |
| `src/modules/marketing-tools.js` | Placeholder helpers for ad copy and outreach drafts. |

## What’s included
- Welcome UI: “Hi, I’m Efasa” with consent banner and feature promises.
- Learning core stub: `src/modules/learning-core.js` for interaction logging (you own the data).
- Marketing placeholder: `src/modules/marketing-tools.js` with a sample ad-writer stub.
- Simulated crawler: `src/modules/crawler-engine.js` orchestrates multi-source stubs (direct-owner, login portals, humanity AI).
- Config defaults: `src/modules/config.js` captures region/targets/cadence and source toggles in one place.
- Source modules: `crawler-direct-owner.js`, `crawler-login-portals.js`, `crawler-humanity-ai.js` illustrate the modular plug-in points.
- Filters: `filters.js` shows where to apply broker filtering and “super deal” highlighting.
- Terms: `terms.md` describing consent, ownership, and learning behavior.

## Run locally
```bash
npm install
npm run dev
# then open http://localhost:5173
```

### Sanity-check the starter structure
If something feels off (e.g., missing `package.json` or entry files), run:
```bash
npm run validate
```
You’ll get a list of missing/invalid files and clear instructions (re-extract or restore from git) before reinstalling deps.

### One-click on Windows
Double-click `scripts/bootstrap-windows.bat` (or run it in PowerShell/CMD). It will:
1) run the preflight (platform/arch, RAM, Node 18+, disk — **fails if Node < 18 or < 4GB free disk**)
2) verify Node.js + npm
3) install dependencies
4) start the Vite dev server

If you get repeated errors about missing `react-scripts` or `package.json`, run `scripts/reset-and-run-windows.bat`. It deep-cleans `node_modules` and the lockfile, reruns the preflight checks, reinstalls dependencies, and starts the dev server from the correct folder. Make sure `index.html` still exists at the project root; if not, re-extract the starter.

If the preflight or dev server fails, run `npm run validate` from this folder to confirm the starter files are present (checks `index.html`, Vite scripts, modules, and helper scripts).

## Package a Windows installer (.exe)
```bash
# Optional: sanity-check OS/RAM/Node/disk from your host
npm run check:system

# Build the web bundle
npm run build

# Package with Electron Builder (outputs to dist-electron/)
npm run electron:build
```

What you get:
- `dist-electron/Efasa-Setup-<version>.exe` (NSIS installer)
- Portable build (no installer) in the same folder
- Node runtime + Chromium (via Electron) bundled for offline use

### Dev preview inside Electron
```bash
# Run Vite at localhost:5173 in another shell
npm run dev

# Launch Electron pointing at the dev server (cross-platform env var handled by cross-env)
npm run electron:dev
```

## Next steps
- Wire `logInteraction` to your chosen storage (local DB, API).
- Attach a backend crawler endpoint to the “Start crawler” button (replace the simulated `runCrawler`).
- Expand marketing helpers (email drafts, social posts) in `marketing-tools.js`.
- Keep the consent copy aligned with `terms.md` and your licensing.
- Drop your own CSS theme or animations in `src/style.css` if you want a different visual style.

### What’s missing today (gap checklist)
- **Crawler logic**: all `crawler-*.js` files are stubs—add real scraping/login flows and API endpoints the UI can call.
- **Scheduler/exports**: no hourly/autopilot runs or CSV/email delivery yet—add a worker plus delivery code.
- **Persistence**: `learning-core` just logs; point it to your database or API with access controls.
- **Avatar/voice**: no embodied assistant is bundled. See `docs/efasa-embodiment.md` for a staged Three.js + TTS plan.
