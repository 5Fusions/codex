import { access, constants, readFile } from 'fs/promises';
import { join } from 'path';

const REQUIRED_FILES = [
  'package.json',
  'index.html',
  'vite.config.js',
  'src/main.jsx',
  'src/App.jsx',
  'src/style.css',
  'src/modules/config.js',
  'src/modules/crawler-engine.js',
  'src/modules/learning-core.js',
  'scripts/check-system.mjs',
  'scripts/bootstrap-windows.bat',
  'scripts/reset-and-run-windows.bat',
];

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const cwd = process.cwd();
  const missing = [];

  for (const rel of REQUIRED_FILES) {
    const full = join(cwd, rel);
    if (!(await exists(full))) {
      missing.push(rel);
    }
  }

  // Validate package.json basics for the starter
  let packageIssues = [];
  if (!(await exists(join(cwd, 'package.json')))) {
    packageIssues.push('package.json not found. Re-extract or restore the starter.');
  } else {
    const pkgRaw = await readFile(join(cwd, 'package.json'), 'utf8');
    try {
      const pkg = JSON.parse(pkgRaw);
      if (pkg.name !== 'efasa-starter') packageIssues.push(`Unexpected package name: ${pkg.name}`);
      if (!pkg.scripts?.dev || !pkg.scripts?.build)
        packageIssues.push('Missing Vite scripts (dev/build). Restore package.json.');
    } catch (err) {
      packageIssues.push(`package.json is not valid JSON: ${err.message}`);
    }
  }

  if (missing.length === 0 && packageIssues.length === 0) {
    console.log('✅ Efasa starter structure looks intact.');
    console.log('Next: npm install && npm run dev (or run scripts/bootstrap-windows.bat on Windows).');
    return;
  }

  console.log('⚠️ Detected issues in the Efasa starter:');
  if (missing.length) {
    console.log('\nMissing files:');
    missing.forEach((rel) => console.log(` - ${rel}`));
    console.log('\nFix: re-extract the starter (examples/efasa-starter) or restore from git.');
  }

  if (packageIssues.length) {
    console.log('\nPackage.json issues:');
    packageIssues.forEach((msg) => console.log(` - ${msg}`));
  }

  console.log('\nAfter fixing, run: npm install && npm run dev');
  console.log('If you are on Windows and tooling is stale, run scripts/reset-and-run-windows.bat');
}

main().catch((err) => {
  console.error('Validation failed:', err);
  process.exitCode = 1;
});
