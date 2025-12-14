import os from "os";
import process from "process";
import { execSync } from "child_process";

function checkPlatform({ warnings }) {
  const platform = os.platform();
  const arch = os.arch();
  if (platform !== "win32") {
    warnings.push(`Installer targets Windows; detected ${platform}.`);
  }
  if (arch !== "x64") {
    warnings.push(`Installer expects 64-bit; detected ${arch}.`);
  }
}

function checkResources({ warnings }) {
  const totalRamGb = Math.round((os.totalmem() / 1024 / 1024 / 1024) * 10) / 10;
  if (totalRamGb < 4) {
    warnings.push(`Detected ${totalRamGb}GB RAM. Recommend at least 4GB for smooth Chromium runs.`);
  }
}

function checkNode({ warnings, errors }) {
  const raw = process.versions.node;
  const major = Number(raw.split(".")[0]);
  if (Number.isNaN(major)) {
    errors.push("Unable to detect Node.js version. Ensure Node 18+ is installed.");
    return;
  }
  if (major < 18) {
    errors.push(`Node ${raw} detected. Efasa builds expect Node 18+. Please upgrade.`);
  } else {
    console.log(`✅ Node ${raw} detected (ok).`);
  }
}

function parseDiskFromDf(output) {
  const lines = output.trim().split(/\r?\n/);
  const dataLine = lines.find((line, idx) => idx > 0 && line.trim());
  if (!dataLine) return null;
  const parts = dataLine.trim().split(/\s+/);
  const availableKb = Number(parts[3]);
  if (Number.isNaN(availableKb)) return null;
  return availableKb / (1024 * 1024); // GB
}

function parseDiskFromWmic(output) {
  const lines = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.toLowerCase().includes("freespace"));
  if (!lines.length) return null;
  const freeBytes = Number(lines[0]);
  if (Number.isNaN(freeBytes)) return null;
  return freeBytes / 1024 / 1024 / 1024;
}

function checkDisk({ warnings, errors }) {
  try {
    const platform = os.platform();
    let freeGb = null;
    if (platform === "win32") {
      const output = execSync("wmic logicaldisk where \"DeviceID='C:'\" get FreeSpace", { encoding: "utf8" });
      freeGb = parseDiskFromWmic(output);
    } else {
      const output = execSync("df -k .", { encoding: "utf8" });
      freeGb = parseDiskFromDf(output);
    }

    if (freeGb === null) {
      warnings.push("Disk check skipped (could not parse free space).");
      return;
    }

    const rounded = Math.round(freeGb * 10) / 10;
    if (rounded < 4) {
      errors.push(`Only ${rounded}GB free. Require at least 4GB before packaging the installer.`);
    } else {
      console.log(`✅ ${rounded}GB free disk space detected.`);
    }
  } catch (err) {
    warnings.push(`Disk check skipped (${err.message}).`);
  }
}

function main() {
  console.log("Running Efasa preflight checks...");
  const warnings = [];
  const errors = [];

  checkPlatform({ warnings });
  checkResources({ warnings });
  checkNode({ warnings, errors });
  checkDisk({ warnings, errors });

  warnings.forEach((msg) => console.log(`⚠️ ${msg}`));
  errors.forEach((msg) => console.log(`❌ ${msg}`));

  if (errors.length) {
    console.log("Preflight failed. Resolve the issues above and re-run.");
    process.exit(1);
  }

  console.log("Preflight complete. Continue to build or run the installer.");
}

main();
