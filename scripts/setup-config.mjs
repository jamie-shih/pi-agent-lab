import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const agentDir = join(root, "config", "agent");
const example = join(agentDir, "models.example.json");
const target = join(agentDir, "models.json");

mkdirSync(agentDir, { recursive: true });

if (!existsSync(target)) {
  copyFileSync(example, target);
  console.log(`Created ${target}`);
  console.log("Edit models.json and set API keys (or env vars), then:");
  console.log("  export PI_CODING_AGENT_DIR=$PWD/config/agent");
} else {
  console.log(`Already exists: ${target}`);
}

console.log("\nTip: project-local config avoids writing to ~/.pi/agent");
