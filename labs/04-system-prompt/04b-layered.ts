/**
 * Lab 04b — assemble system prompt from files + dynamic user context.
 *
 * Curriculum: dg-ai-notes P04 · layered prompts
 *
 * Run: export PI_CODING_AGENT_DIR=$PWD/config/agent && npm run lab:04b
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
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

const promptsDir = join(process.cwd(), "prompts", "analyst");
const [persona, rules, outputFormat] = await Promise.all([
  readFile(join(promptsDir, "persona.md"), "utf8"),
  readFile(join(promptsDir, "rules.md"), "utf8"),
  readFile(join(promptsDir, "output-format.md"), "utf8"),
]);

async function getUserContext(userId: string) {
  const users: Record<
    string,
    { name: string; department: string; role: string; dataScope: string }
  > = {
    u001: {
      name: "王小姐",
      department: "销售部",
      role: "销售经理",
      dataScope: "本部门销售数据",
    },
    u002: {
      name: "李先生",
      department: "财务部",
      role: "财务分析师",
      dataScope: "全公司财务数据",
    },
  };
  return (
    users[userId] ?? {
      name: "未知用户",
      department: "未知",
      role: "访客",
      dataScope: "无",
    }
  );
}

const userId = process.argv[2] ?? "u001";
const user = await getUserContext(userId);

const fullPrompt = [
  persona.trim(),
  [
    "## 当前用户上下文",
    `姓名：${user.name}`,
    `部门：${user.department}`,
    `角色：${user.role}`,
    `数据权限范围：${user.dataScope}`,
    "（回答时只涉及该用户有权访问的数据范围）",
  ].join("\n"),
  rules.trim(),
  outputFormat.trim(),
].join("\n\n");

const loader = new DefaultResourceLoader({
  cwd: process.cwd(),
  agentDir: getAgentDir(),
  systemPromptOverride: () => fullPrompt,
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
  console.log(
    `user: ${user.name} (${user.department} / ${user.dataScope})\n`,
  );
  await session.prompt(
    "上月销售额下降了 15%，可能的原因有哪些？请简短回答。",
  );
  console.log("\n");
} finally {
  session.dispose();
}

console.log("lab:04b done");
