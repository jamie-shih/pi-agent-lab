/**
 * Lab 01 — smoke-test the Pi coding-agent SDK.
 *
 * Goal: load local model config, open a session, stream one reply.
 * Curriculum map: dg-ai-notes 实战上手篇 P01（环境部署）
 *
 * Run:
 *   export PI_CODING_AGENT_DIR=$PWD/config/agent   # optional project-local config
 *   npm run lab:01
 */
import { createAgentSession, ModelRuntime } from "@earendil-works/pi-coding-agent";

const modelRuntime = await ModelRuntime.create();
const available = await modelRuntime.getAvailable();
const model = available[0];

if (!model) {
  console.error(
    "No usable model found. Copy config/agent/models.example.json → models.json, set a key, then retry.",
  );
  console.error("Or configure ~/.pi/agent/models.json (see docs/learning-path.md).");
  process.exit(1);
}

const { session } = await createAgentSession({ model, modelRuntime });

try {
  session.subscribe((event) => {
    if (
      event.type === "message_update" &&
      event.assistantMessageEvent.type === "text_delta"
    ) {
      process.stdout.write(event.assistantMessageEvent.delta);
    }
  });

  console.log(`model: ${model.provider}/${model.id}\n`);
  await session.prompt("Introduce yourself in one short sentence.");
  console.log("\n");
} finally {
  session.dispose();
}
