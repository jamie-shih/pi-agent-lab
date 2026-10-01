/**
 * Lab 03 — ModelRuntime: list / getModel / setModel.
 *
 * Curriculum map: dg-ai-notes 实战上手篇 P03（模型配置）
 *
 * Run:
 *   export PI_CODING_AGENT_DIR=$PWD/config/agent
 *   npm run lab:03
 */
import {
  createAgentSession,
  ModelRuntime,
  SessionManager,
} from "@earendil-works/pi-coding-agent";

const modelRuntime = await ModelRuntime.create();
const available = await modelRuntime.getAvailable();

console.log(`\navailable models: ${available.length}`);
for (const [i, m] of available.entries()) {
  console.log(`  ${i + 1}. ${m.provider}/${m.id}  (${m.name})`);
}

if (available.length === 0) {
  console.error("No usable model. Finish P01 config first.");
  process.exit(1);
}

const first = available[0];
const lookedUp = modelRuntime.getModel(first.provider, first.id);

console.log("\ngetModel() snapshot:");
if (lookedUp) {
  console.log(`  provider      : ${lookedUp.provider}`);
  console.log(`  id            : ${lookedUp.id}`);
  console.log(`  name          : ${lookedUp.name}`);
  console.log(`  reasoning     : ${lookedUp.reasoning}`);
  console.log(`  contextWindow : ${lookedUp.contextWindow}`);
  console.log(`  maxTokens     : ${lookedUp.maxTokens}`);
} else {
  console.log("  (not found)");
}

// inMemory: avoid writing session jsonl into the lab workspace during model drills
const { session } = await createAgentSession({
  model: first,
  modelRuntime,
  thinkingLevel: "medium",
  sessionManager: SessionManager.inMemory(),
});

try {
  session.subscribe((event) => {
    if (
      event.type === "message_update" &&
      event.assistantMessageEvent.type === "text_delta"
    ) {
      process.stdout.write(event.assistantMessageEvent.delta);
      return;
    }

    if (event.type === "message_end" && event.message.role === "assistant") {
      const msg = event.message as {
        stopReason?: string;
        errorMessage?: string;
      };
      if (msg.stopReason === "error") {
        console.error(`\n[assistant error] ${msg.errorMessage ?? "(unknown)"}`);
      }
      return;
    }

    if (event.type === "auto_retry_start") {
      console.error(
        `\n[retry ${event.attempt}/${event.maxAttempts}] ${event.errorMessage}`,
      );
    }
  });

  console.log(`\nprompt with ${first.provider}/${first.id}\n`);
  await session.prompt("Reply with exactly: model-check-ok");
  console.log("\n");

  // Prefer a second cheap-ish chat model for the switch demo when present
  const second =
    available.find(
      (m) =>
        m.provider === first.provider &&
        m.id !== first.id &&
        /mini|flash|turbo/i.test(m.id),
    ) ?? available.find((m) => m.id !== first.id);

  if (second) {
    console.log(`\nsetModel → ${second.provider}/${second.id}\n`);
    await session.setModel(second);
    await session.prompt("Reply with exactly: switched-ok");
    console.log("\n");
  } else {
    console.log(
      "\n(only one available model — add another in models.json to exercise setModel)\n",
    );
  }
} finally {
  session.dispose();
}

console.log("lab:03 done");
