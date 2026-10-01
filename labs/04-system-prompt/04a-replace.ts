/**
 * Lab 04a — replace default coding persona via systemPromptOverride.
 *
 * Curriculum: dg-ai-notes P04（系统提示词）· ResourceLoader
 *
 * Run: export PI_CODING_AGENT_DIR=$PWD/config/agent && npm run lab:04a
 */
import {
  createAgentSession,
  DefaultResourceLoader,
  getAgentDir,
  ModelRuntime,
  SessionManager,
} from "@earendil-works/pi-coding-agent";

const modelRuntime = await ModelRuntime.create();
const available = await modelRuntime.getAvailable();
const model =
  available.find((m) => m.id === "gpt-4.1-mini") ?? available[0];

if (!model) {
  console.error("No usable model. Finish P01 config first.");
  process.exit(1);
}

const loader = new DefaultResourceLoader({
  cwd: process.cwd(),
  agentDir: getAgentDir(),
  // Replace base persona entirely (ignore SDK coding-assistant default)
  systemPromptOverride: () =>
    [
      "你是一个企业数据分析助手，帮业务方分析销售数据、定位问题、给出建议。",
      "",
      "## 工作规则",
      "1. 回答前先确认已知信息和未知信息",
      "2. 不要编造数据，未知就说未知",
      "3. 分析按可能性从高到低排序，并附验证方法",
      "4. 开场必须用：「作为数据分析助手，我的判断是：」",
    ].join("\n"),
  // Clear append rules so APPEND_SYSTEM.md cannot leak in
  appendSystemPromptOverride: () => [],
});
await loader.reload();

const { session } = await createAgentSession({
  model,
  modelRuntime,
  resourceLoader: loader,
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
    }
  });

  console.log(`model: ${model.provider}/${model.id}`);
  console.log("expect persona marker: 「作为数据分析助手，我的判断是：」\n");
  await session.prompt(
    "上月销售额下降了 15%，可能的原因有哪些？请简短回答。",
  );
  console.log("\n");
} finally {
  session.dispose();
}

console.log("lab:04a done");
