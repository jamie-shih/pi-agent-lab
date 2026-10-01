/**
 * Lab 06b — panorama: log major extension events for one prompt.
 *
 * Curriculum: dg-ai-notes P06
 *
 * Run:
 *   export PI_CODING_AGENT_DIR=$PWD/config/agent
 *   npm run lab:06b
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import {
  createAgentSession,
  DefaultResourceLoader,
  getAgentDir,
  ModelRuntime,
  SessionManager,
} from "@earendil-works/pi-coding-agent";

function seeAllEventsExtension(pi: ExtensionAPI) {
  const stamp = (label: string) => () => {
    console.error(`  📡 ${label}`);
  };

  console.error("\n========== extension ready ==========\n");

  pi.on("session_start", stamp("session_start"));
  pi.on("before_agent_start", stamp("before_agent_start (extension-only)"));
  pi.on("agent_start", stamp("agent_start"));
  pi.on("turn_start", stamp("turn_start"));
  pi.on("turn_end", stamp("turn_end"));
  pi.on("agent_end", stamp("agent_end"));
  pi.on("agent_settled", stamp("agent_settled"));

  pi.on("input", stamp("input (extension-only)"));
  pi.on("context", stamp("context (extension-only)"));
  pi.on("before_provider_request", stamp("before_provider_request"));
  pi.on("after_provider_response", stamp("after_provider_response"));

  pi.on("message_start", stamp("message_start"));
  // message_update is very chatty — skip full spam, mark once via start/end
  pi.on("message_end", stamp("message_end"));

  pi.on("tool_call", stamp("tool_call (extension-only, can block)"));
  pi.on("tool_execution_start", stamp("tool_execution_start"));
  pi.on("tool_execution_end", stamp("tool_execution_end"));
  pi.on("tool_result", stamp("tool_result (extension-only)"));
}

const loader = new DefaultResourceLoader({
  cwd: process.cwd(),
  agentDir: getAgentDir(),
  appendSystemPromptOverride: () => [],
  extensionFactories: [seeAllEventsExtension],
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
  noTools: "all",
  sessionManager: SessionManager.inMemory(),
});

try {
  session.subscribe((event) => {
    if (
      event.type === "message_update" &&
      event.assistantMessageEvent.type === "text_delta"
    ) {
      process.stdout.write(event.assistantMessageEvent.delta);
    }
  });

  console.log(`model: ${model.provider}/${model.id}`);
  console.log("prompt: 1+1 (no tools)\n");
  await session.prompt("1 加 1 等于几？用一句话回答。");
  console.log("\n\n========== event stream end ==========\n");
} finally {
  session.dispose();
}

console.log("lab:06b done");
