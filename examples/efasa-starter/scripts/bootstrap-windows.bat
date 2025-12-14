@echo off
setlocal enabledelayedexpansion

REM Simple Windows bootstrap for Efasa starter.
REM 1) Ensures Node.js + npm exist
REM 2) Runs npm install (idempotent)
REM 3) Starts the Vite dev server

pushd %~dp0\..

where node >NUL 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Node.js not found. Install Node 18+ from https://nodejs.org/ and re-run this script.
  exit /b 1
)

where npm >NUL 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo [ERROR] npm not found. Install Node.js (includes npm) and re-run this script.
  exit /b 1
)

if not exist package.json (
  echo [ERROR] package.json is missing. Run this script from the efasa-starter folder.
  exit /b 1
)

echo [INFO] Running preflight (platform, RAM, Node, disk)...
node scripts/check-system.mjs
if %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Preflight failed. Fix the issues above (Node 18+, 64-bit, >=4GB free disk) and re-run.
  exit /b 1
)

echo [INFO] Installing dependencies (this may take a minute)...
npm install
if %ERRORLEVEL% NEQ 0 (
  echo [ERROR] npm install failed. See errors above.
  exit /b 1
)

echo [INFO] Starting Efasa (Vite dev server)...
npm run dev

popd
endlocal
