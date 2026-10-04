# Real Estate Fusions GPT (RFG) Rebuild Plan

This plan captures the current state of the shipped web bundle, highlights likely sources of instability, and outlines how to rebuild the RFG client as an isolated, dependable crawler companion.

## What we know about the current bundle
- Entry point is `#root` in `index.html`, with a React 18 production bundle (`index-k-UeRx4j.js`) and Tailwind-style utility CSS (`index-CtkmPY5h.css`).
- The bundle is minified; component boundaries are opaque, making targeted fixes difficult.
- Service-worker/PWA hooks may exist (installable behavior), but that code is embedded in the bundle and not inspectable.

## Issues reported
- "Too many errors" during runtime or integration.
- Potential dependency interference from bundled third-party scripts or global CSS/JS.
- Desire to rename and relaunch the app with a clean, isolated architecture.

## Goals for the rebuild
- Fresh React scaffold (e.g., Vite) with clear component boundaries and zero known runtime errors.
- Minimal, vetted dependencies to avoid interference (keep Tailwind if desired, otherwise use CSS modules).
- Optional PWA support that is explicit and testable, not hidden in a minified bundle.
- Command-only copilot behavior: the crawler acts only on explicit user commands, not autonomously.
- Installable on desktop and (optionally) Android/Termux; align with existing Primator/RFG profiles.

## Proposed project structure
```
new-app-name/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── tailwind.config.js (if using Tailwind)
├── vite.config.js
└── README.md
```

## Implementation steps
1. **Scaffold** a new Vite + React app (optionally with Tailwind). Remove unused boilerplate.
2. **Define core flows**: search/scrape orchestration UI, run logs, scheduling controls, and export (CSV/HTML) viewers.
3. **Isolate dependencies**: avoid global scripts; prefer direct npm packages. Keep styling either via Tailwind or CSS modules.
4. **PWA (optional)**: add service worker explicitly; test installability. Skip if stability is priority.
5. **Command-only guardrails**: bake the RFG preamble and approval policy into the config/profile; no autonomous actions without commands.
6. **Provider “brains”**: wire to Codex providers (OpenAI/Gemini/DeepSeek/Ollama) via the brain pack; keep the swapability documented.
7. **Packaging**: document desktop and Termux install steps; include an npm script for `npm run build` and `npm run preview`.
8. **Quality gates**: run `npm test`/linters and browser sanity checks; capture known-good screenshots once UI stabilizes.

## Verification and stabilization checklist
- **Reproduce current errors**: run the existing bundle locally, capture console/network errors, and list reproducible steps.
- **Isolate third-party interference**: note any injected scripts or globals; plan to replace them with direct npm deps or remove them.
- **Define the crawl loop**: confirm the hourly Quebec-wide scrape, CSV/HTML export, and approval-only execution contract.
- **Guardrails**: keep command-only mode and approvals on by default in the profile used during manual and scheduled runs.
- **Cross-device install**: confirm desktop and optional Termux install flows still work after the rebuild (PWA or local CLI).

## Next actions
- Confirm the new app name (current placeholder: `new-app-name`).
- Decide whether to keep Tailwind or switch to CSS modules.
- List the minimum feature set for the first rebuild drop (e.g., search form, results grid, export, schedule toggle).
- After decisions, scaffold and commit the clean project, replacing the opaque bundle with source-controlled components.
