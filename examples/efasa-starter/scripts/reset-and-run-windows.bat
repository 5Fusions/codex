@echo off
setlocal enabledelayedexpansion

REM Deep clean + reinstall + start Efasa (Windows)
REM Use this if npm start complains about missing react-scripts or packages.

pushd %~dp0\..

if not exist package.json (
  echo [ERROR] package.json is missing. Run from the efasa-starter folder.
  exit /b 1
)

if not exist public\index.html (
  echo [ERROR] public\index.html is missing. Re-extract the starter or restore the file before continuing.
  exit /b 1
)

echo [INFO] Running preflight (platform/RAM/Node/disk)...
node scripts/check-system.mjs
if %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Preflight failed. Fix the issues above (Node 18+, 64-bit, >=4GB free disk) and re-run.
  exit /b 1
)

echo [INFO] Removing node_modules and package-lock.json...
if exist node_modules rmdir /S /Q node_modules
if exist package-lock.json del /F /Q package-lock.json

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

echo [INFO] Installing dependencies...
npm install
if %ERRORLEVEL% NEQ 0 (
  echo [ERROR] npm install failed. See errors above.
  exit /b 1
)

echo [INFO] Starting Efasa (Vite dev server)...
npm run dev

popd
endlocal
