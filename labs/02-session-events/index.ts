/**
 * Lab 02 — observe the AgentSession event stream.
 *
 * Goal: see which events fire during a single prompt turn.
 * Curriculum map: dg-ai-notes 实战上手篇 P02 / 源码精读 M03·M07
 *
 * Run:
 *   npm run lab:02
 */
import { createAgentSession, ModelRuntime } from "@earendil-works/pi-coding-agent";

const modelRuntime = await ModelRuntime.create();
const available = await modelRuntime.getAvailable();
const model = available[0];

if (!model) {
  console.error("No usable model found. Finish Lab 01 config first.");
  process.exit(1);
}

const { session } = await createAgentSession({ model, modelRuntime });
const counts = new Map<string, number>();

try {
  session.subscribe((event) => {
    counts.set(event.type, (counts.get(event.type) ?? 0) + 1);

    if (
      event.type === "message_update" &&
      event.assistantMessageEvent.type === "text_delta"
    ) {
      process.stdout.write(event.assistantMessageEvent.delta);
      return;
    }

    if (event.type === "message_update") {
      return;
    }

    console.error(`[event] ${event.type}`);
  });

  console.log(`model: ${model.provider}/${model.id}\n`);
  await session.prompt("Reply with exactly three words.");
  console.log("\n\n--- event counts ---");
  for (const [type, n] of [...counts.entries()].sort()) {
    console.log(`${type}: ${n}`);
  }
} finally {
  session.dispose();
}
