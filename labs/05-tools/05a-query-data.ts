/**
 * Lab 05a — defineTool + customTools: query_data over sales.csv.
 *
 * Curriculum: dg-ai-notes P05（定义工具）
 *
 * Run:
 *   export PI_CODING_AGENT_DIR=$PWD/config/agent
 *   npm run lab:05
 */
import {
  createAgentSession,
  DefaultResourceLoader,
  getAgentDir,
  ModelRuntime,
  SessionManager,
} from "@earendil-works/pi-coding-agent";
import { queryDataTool } from "../../shared/tools/query-data.js";

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
  systemPromptOverride: () =>
    [
      "你是一个企业数据分析助手。",
      "查销售数据时必须调用 query_data 工具，不要编造数字。",
      "开场用：「作为数据分析助手，我的判断是：」",
    ].join("\n"),
  appendSystemPromptOverride: () => [],
});
await loader.reload();

const { session } = await createAgentSession({
  model,
  modelRuntime,
  resourceLoader: loader,
  customTools: [queryDataTool],
  // Hide coding built-ins (bash/write/edit/read); keep only custom tool
  noTools: "builtin",
  tools: ["query_data"],
  sessionManager: SessionManager.inMemory(),
});

try {
  let toolCalls = 0;
  session.subscribe((event) => {
    if (event.type === "tool_execution_start") {
      toolCalls += 1;
      console.error(`[tool] ${event.toolName}`);
      return;
    }
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
  console.log("expect: tool_execution_start for query_data\n");
  await session.prompt("华东地区一共多少销售额？请基于真实查询结果回答。");
  console.log(`\n\ntool calls observed: ${toolCalls}`);
} finally {
  session.dispose();
}

console.log("lab:05 done");
