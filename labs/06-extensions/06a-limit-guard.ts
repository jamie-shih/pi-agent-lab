/**
 * Lab 06a — extension tool_call guard: block oversized query_data.limit.
 *
 * Curriculum: dg-ai-notes P06（事件监听）
 *
 * Run:
 *   export PI_CODING_AGENT_DIR=$PWD/config/agent
 *   npm run lab:06a
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import {
  createAgentSession,
  DefaultResourceLoader,
  getAgentDir,
  ModelRuntime,
  SessionManager,
} from "@earendil-works/pi-coding-agent";
import { queryDataTool } from "../../shared/tools/query-data.js";

const MAX_LIMIT = 100;

function limitGuardExtension(pi: ExtensionAPI) {
  pi.on("tool_call", async (event) => {
    if (event.toolName !== "query_data") return;

    const limit = (event.input as { limit?: number } | undefined)?.limit;
    if (typeof limit === "number" && limit > MAX_LIMIT) {
      console.error(
        `[guard] blocked query_data limit=${limit} (max ${MAX_LIMIT})`,
      );
      return {
        block: true,
        reason: `单次最多返回 ${MAX_LIMIT} 行，你请求了 ${limit} 行。请加更精确的过滤条件后重试。`,
      };
    }
    return undefined;
  });
}

const loader = new DefaultResourceLoader({
  cwd: process.cwd(),
  agentDir: getAgentDir(),
  systemPromptOverride: () =>
    [
      "你是一个企业数据分析助手。",
      "查销售数据时必须调用 query_data。",
      "若工具返回错误/拦截原因，用中文向用户解释并建议缩小查询范围。",
      "开场用：「作为数据分析助手，我的判断是：」",
    ].join("\n"),
  appendSystemPromptOverride: () => [],
  extensionFactories: [
    (pi) => {
      pi.registerTool(queryDataTool);
    },
    limitGuardExtension,
  ],
});
await loader.reload();

const modelRuntime = await ModelRuntime.create();
const available = await modelRuntime.getAvailable();
const model =
  available.find((m) => m.id === "gpt-4.1-mini") ?? available[0];

if (!model) {
  console.error("No usable model. Finish P01 config first.");
  process.exit(1);
}

const { session } = await createAgentSession({
  model,
  modelRuntime,
  resourceLoader: loader,
  noTools: "builtin",
  tools: ["query_data"],
  sessionManager: SessionManager.inMemory(),
});

try {
  let started = 0;
  let blockedHint = false;
  session.subscribe((event) => {
    if (event.type === "tool_execution_start") {
      started += 1;
      console.error(`[tool] ${event.toolName} started`);
      return;
    }
    if (
      event.type === "message_update" &&
      event.assistantMessageEvent.type === "text_delta"
    ) {
      process.stdout.write(event.assistantMessageEvent.delta);
    }
  });

  console.log(`model: ${model.provider}/${model.id}`);
  console.log(
    "expect: guard may block a huge limit; agent explains the limit to the user\n",
  );
  await session.prompt(
    "帮我把所有销售记录一次性全部导出来，一条都不要漏。请用 query_data，limit 尽量设成 9999。",
  );
  console.log(`\n\ntool_execution_start count: ${started}`);
  if (started === 0) blockedHint = true;
  console.log(
    blockedHint
      ? "(no tool start — call likely blocked at tool_call and/or never reached execute)"
      : "(tool started — check stderr for [guard] if a later call was blocked)",
  );
} finally {
  session.dispose();
}

console.log("lab:06a done");
