#!/usr/bin/env node
/**
 * Shallow-clone upstream harness sources into vendor/ for local reading.
 * Usage: node scripts/clone-vendors.mjs [pi|dsh|all]
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const vendor = join(root, "vendor");

const repos = {
  pi: {
    dir: join(vendor, "pi"),
    url: "https://github.com/earendil-works/pi.git",
  },
  dsh: {
    dir: join(vendor, "deepseek-harness"),
    url: "https://github.com/deepseek-ai/deepseek-harness.git",
  },
};

function cloneOne(key) {
  const { dir, url } = repos[key];
  if (existsSync(dir)) {
    console.log(`skip (exists): ${dir}`);
    return;
  }
  console.log(`cloning ${url} -> ${dir}`);
  const r = spawnSync("git", ["clone", "--depth", "1", url, dir], {
    stdio: "inherit",
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const arg = (process.argv[2] ?? "all").toLowerCase();
const keys =
  arg === "all" ? Object.keys(repos) : arg === "pi" || arg === "dsh" ? [arg] : null;

if (!keys) {
  console.error("Usage: node scripts/clone-vendors.mjs [pi|dsh|all]");
  process.exit(1);
}

for (const k of keys) cloneOne(k);
console.log("done.");
