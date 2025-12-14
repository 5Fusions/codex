# Efasa (E-State Fusions AI Search Agent)

Efasa is the official identity for the real-estate-focused copilot previously drafted as RFG. She is a command-only, approval-gated agent that scans Quebec listings, helps with marketing copy, and learns from user interactions with transparent consent.

## Purpose and roles

| Role | Description |
| --- | --- |
| 🛰️ Autonomous search agent | Scans public Quebec listings (direct-owner classifieds plus standout brokerage deals) on a schedule you approve. |
| 👩‍💼 Agent’s co-pilot | Saves time by surfacing fresh opportunities, filtering by your criteria, and exporting results. |
| ✍️ Writing & marketing | Drafts ads, outreach emails, and social posts. |
| 🌐 Research agent | (Pro) Uses a browsing-capable model/provider for real-time answers. |
| 🧠 Learning AI | Improves from interaction logs you own. |
| 🔐 Controlled data ownership | Interaction data belongs to you and requires explicit consent at install. |

## Data handling philosophy (keep this in your UI and terms)

- Efasa learns from how you use her (clicks, prompts, approvals).
- No personal client data is collected unless the user enters it explicitly.
- Interaction logs belong to your company; do not sell or share them.
- Consent is required at install/license activation and reiterated in-app.

## Multi-source scope (not a single-site crawler)

- Direct-owner/public classifieds (e.g., Kijiji, LesPAC, Craigslist, forums, bulletin boards).
- Login-walled portals for owner listings (e.g., DuProprio, semi-private marketplaces) gated behind approval.
- Humanity AI landline/registry checks (e.g., Canada411 + property registries) for ethical outreach.
- Optional additional sources can be toggled via configuration; every source should remain modular.

Include language such as:

> “Efasa learns from how you use her. We do not collect personal client data unless you enter it. Interaction logs belong to you and are used to improve Efasa. By continuing, you consent to this learning behavior.”

## Starter project (ready to copy)

A minimal Vite + React starter lives in `examples/efasa-starter/` with:
- Welcome message (“Hi, I’m Efasa 👋”) and consent copy in `src/App.jsx`.
- Learning stub in `src/modules/learning-core.js` for interaction logging you own.
- Marketing placeholder in `src/modules/marketing-tools.js` for ad/ outreach drafts.
- Simulated crawler in `src/modules/crawler-engine.js` so the UI and flow work before a backend exists.
- Shared defaults in `src/modules/config.js` for region/targets/cadence.
- Consent/ownership terms in `terms.md`.

### Run locally
```bash
cd examples/efasa-starter
npm install
npm run dev
# open http://localhost:5173
```
- Windows one-click: run `scripts/bootstrap-windows.bat` to auto-install dependencies and start the dev server.
- If Windows reports missing `react-scripts` or `package.json`, run `scripts/reset-and-run-windows.bat`. It deep-cleans `node_modules`, removes the lockfile, reruns preflight checks, reinstalls, and starts the dev server (requires `public/index.html` to still exist — re-extract if missing).

### Package a Windows installer
See `docs/efasa-installer.md` for the end-to-end Electron builder flow. In short:
```bash
cd examples/efasa-starter
npm install
npm run build
npm run electron:build
# outputs dist-electron/Efasa-Setup-<version>.exe
```

### Next implementation steps
- Connect the “Start crawler” button to your backend crawler endpoint.
- Route interaction events from `logInteraction` to your chosen storage (local DB, API, or encrypted file) with access controls.
- Add scheduling/export logic (CSV/HTML) behind an approval gate.
- Swap in your preferred model/provider (OpenAI, Gemini, DeepSeek, Ollama) while keeping the command-only contract.
- Keep UI consent text aligned with `terms.md` and license flows.

### What’s still missing (gap checklist)
- **No real crawler yet**: `src/modules/crawler-*.js` are stubs. Add site-specific scraping, authentication flows, throttling, and a REST/IPC endpoint the UI can call.
- **No backend APIs**: there is no server for crawl orchestration, CSV/HTML generation, or email delivery. Add an API (Express/Fastify) under `src/core/` and wire it to the UI buttons.
- **No scheduler/exporter**: autopilot/hourly runs and CSV/email outputs are not implemented—add a cron/schedule worker and delivery logic.
- **No persistence**: `learning-core` just logs to console; point it to your storage (local DB/file or remote API) with access control.
- **No avatar/voice**: the starter ships only UI copy. If you want an embodied assistant, follow `docs/efasa-embodiment.md` to embed a 3D/voice layer.

See `docs/efasa-embodiment.md` for the staged avatar/voice plan.

## File map

- `examples/efasa-starter/src/App.jsx`: Efasa welcome screen with promises and consent notice + live status tiles.
- `examples/efasa-starter/src/modules/learning-core.js`: Stub for interaction logging.
- `examples/efasa-starter/src/modules/marketing-tools.js`: Placeholder for ad copy helper.
- `examples/efasa-starter/src/modules/crawler-engine.js`: Mock crawler to exercise the UI before real scraping exists.
- `examples/efasa-starter/src/modules/config.js`: Centralized defaults for region/targets/cadence.
- `examples/efasa-starter/scripts/bootstrap-windows.bat`: One-click Windows helper that installs dependencies and starts dev.
- `examples/efasa-starter/scripts/reset-and-run-windows.bat`: Deep-clean + reinstall helper for Windows when tooling goes out of sync.
- `examples/efasa-starter/terms.md`: Consent + data ownership terms.

## Naming and credits

Use “Efasa (E-State Fusions AI Search Agent)” in UI titles and documentation. Keep the consent statement visible wherever users start crawls or enable learning features.
