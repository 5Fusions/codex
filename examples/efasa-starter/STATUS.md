# Efasa starter health snapshot

Use this checklist to verify the starter is intact and understand what still needs implementation before Efasa becomes a fully functional agent.

## Latest integrity check
- `npm run validate` (from `examples/efasa-starter`) **passes** as of this snapshot; entrypoints, scripts, and modules are present.
- If Windows tooling drifts, run `scripts/reset-and-run-windows.bat` to deep-clean, rerun preflight checks, reinstall deps, and start the dev server.

## What works now
- Vite + React UI with consent copy, feature tiles, and simulated multi-source crawler results (`runCrawler` uses mock data).
- Config defaults for Quebec-wide sources, cadence, and filters in `src/modules/config.js`.
- Learning and marketing stubs (`learning-core.js`, `marketing-tools.js`) so you can wire telemetry and ad drafting later.
- Windows helpers (`bootstrap-windows.bat`, `check-system.mjs`, `reset-and-run-windows.bat`) for preflight + one-click dev startup.

## What’s still missing (to fill in)
- **Real crawler engines**: replace stubs in `src/modules/crawler-*.js` and `crawler-engine.js` with live scraping/auth flows and API endpoints.
- **Backend orchestration**: add a server under `src/core/` (Express/Fastify/etc.) to expose crawl/schedule/export routes consumed by the UI.
- **Scheduler + exports**: implement hourly/approval-gated jobs plus CSV/HTML/email delivery.
- **Persistence**: route `logInteraction` to storage (DB/file/API) with access controls instead of console logging.
- **Avatar/voice layer**: no 3D or TTS is bundled; follow `docs/efasa-embodiment.md` if you want the on-screen persona.
- **Installer polish**: the Electron/NSIS scaffold is present, but branding assets, icon, and EULA screens remain placeholders.

## Next suggested steps
1) Run `npm install && npm run dev` (or the Windows bootstrap) to confirm the UI spins up.
2) Decide which sources to ship first and implement the corresponding `crawler-*.js` modules.
3) Stand up a backend endpoint for the “Start crawler” button and connect CSV/email delivery.
4) Keep consent + terms aligned with `terms.md` once telemetry/persistence are wired.
