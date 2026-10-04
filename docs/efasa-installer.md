# Efasa Windows installer (.exe) quickstart

This guide packages the Efasa starter (`examples/efasa-starter/`) into a Windows installer that bundles Node, Chromium (via Electron), and your web UI for offline-first use.

## Prerequisites
- Windows 8/10/11, 64-bit
- Node.js 18+ installed on the build machine
- 4GB+ RAM recommended (Chromium)

Run a quick preflight from the project root (platform/arch, RAM, Node 18+, disk space). The Windows bootstrap script runs this
automatically and **fails** if Node < 18 or free disk < 4GB. You can trigger it manually too:
```bash
cd examples/efasa-starter
npm install
npm run check:system
```

## Build the installer
```bash
# From examples/efasa-starter
npm run build           # builds the Vite web bundle
npm run electron:build  # outputs to dist-electron/
```

Outputs:
- `dist-electron/Efasa-Setup-<version>.exe` (NSIS one-click installer)
- `dist-electron/Efasa-Setup-<version>.portable.exe` (portable build)

The installer bundles:
- Efasa UI and consent terms
- Node runtime and Electron/Chromium (offline-capable)
- Learning/marketing stubs and your future crawler hooks

## Dev preview inside Electron
```bash
# Terminal A: start Vite
npm run dev

# Terminal B: launch Electron pointing at the dev server (cross-env sets EFS_DEV_SERVER_URL)
npm run electron:dev
```

## Customization tips
- Add a branded icon at `examples/efasa-starter/build/icon.ico` before running `electron:build`.
- Adjust installer targets in `examples/efasa-starter/electron-builder.yml` (NSIS vs portable).
- Extend `scripts/check-system.mjs` if you want stricter RAM/disk checks.
- Add preload IPC bridges in `electron/preload.cjs` for desktop-only features (file pickers, schedulers).

## Shipping
- Share the `.exe` from `dist-electron/` with agents.
- After installation, Efasa can run offline; allow network only if you enable online crawling or model providers.
