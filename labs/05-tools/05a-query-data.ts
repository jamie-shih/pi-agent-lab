/**
 * Lab 05a — defineTool + customTools: query_data over sales.csv.
 *
 * Curriculum: dg-ai-notes P05（定义工具）
 *
 * Run:
 *   export PI_CODING_AGENT_DIR=$PWD/config/agent
 *   npm run lab:05
 */
import { Type } from "typebox";
import {
  createAgentSession,
  DefaultResourceLoader,
  defineTool,
  getAgentDir,
  ModelRuntime,
  SessionManager,
} from "@earendil-works/pi-coding-agent";
import { querySales } from "../../shared/query-sales.js";

const queryDataTool = defineTool({
  name: "query_data",
  label: "查询销售数据",
  description:
    "查询销售数据（sales.csv）。按指定列的条件过滤，返回匹配的行。字段：日期、产品、地区、销售额、数量、销售人员。需要汇总销售额时先查出匹配行再自行相加。",
  parameters: Type.Object({
    column: Type.String({
      description: "要过滤的列名，如：地区、产品、销售人员、销售额",
    }),
    operator: Type.Union(
      [
        Type.Literal("="),
        Type.Literal("!="),
        Type.Literal(">"),
        Type.Literal("<"),
        Type.Literal(">="),
        Type.Literal("<="),
        Type.Literal("contains"),
      ],
      { description: "比较运算符：= != > < >= <= contains" },
    ),
    value: Type.String({ description: "过滤条件的值" }),
    limit: Type.Optional(Type.Number({ description: "最多返回行数，默认 20" })),
  }),
  async execute(_id, params) {
    const text = querySales(
      params.column,
      params.operator,
      params.value,
      params.limit,
    );
    return { content: [{ type: "text", text }], details: {} };
  },
});

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
