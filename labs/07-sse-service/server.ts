/**
 * Lab 07 — DataAgent as an HTTP + SSE service (single POST /chat stream).
 *
 * Curriculum: dg-ai-notes P07（准备上线）
 *
 * Run:
 *   export PI_CODING_AGENT_DIR=$PWD/config/agent
 *   npm run lab:07
 * Open http://localhost:3000
 */
import express from "express";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import {
  createAgentSession,
  DefaultResourceLoader,
  getAgentDir,
  ModelRuntime,
  SessionManager,
} from "@earendil-works/pi-coding-agent";
import { queryDataTool } from "../../shared/tools/query-data.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 3000);
const MAX_LIMIT = 100;

function limitGuardExtension(pi: ExtensionAPI) {
  pi.on("tool_call", async (event) => {
    if (event.toolName !== "query_data") return;
    const limit = (event.input as { limit?: number } | undefined)?.limit;
    if (typeof limit === "number" && limit > MAX_LIMIT) {
      return {
        block: true,
        reason: `单次最多返回 ${MAX_LIMIT} 行，你请求了 ${limit} 行。请缩小范围后重试。`,
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
      "你是企业数据分析助手。",
      "回答必须基于 query_data 查到的真实销售数据，不要编造数字。",
      "用中文，结论先行，必要时给出明细。",
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
  throw new Error("No usable model. Finish P01 config first.");
}

const { session } = await createAgentSession({
  model,
  modelRuntime,
  resourceLoader: loader,
  noTools: "builtin",
  tools: ["query_data"],
  sessionManager: SessionManager.inMemory(),
});

function sse(type: string, data: unknown): string {
  return `data: ${JSON.stringify({ type, data })}\n\n`;
}

function translateEvent(event: {
  type: string;
  assistantMessageEvent?: { type: string; delta?: string };
  toolCallId?: string;
  toolName?: string;
  args?: unknown;
  result?: { content?: Array<{ text?: string }> };
  isError?: boolean;
}): string | null {
  switch (event.type) {
    case "message_update": {
      const ae = event.assistantMessageEvent;
      if (ae?.type === "text_delta" && ae.delta) {
        return sse("text", { delta: ae.delta });
      }
      if (ae?.type === "thinking_delta" && ae.delta) {
        return sse("thinking", { delta: ae.delta });
      }
      return null;
    }
    case "tool_execution_start":
      return sse("tool_start", {
        id: event.toolCallId,
        name: event.toolName,
        args: event.args,
      });
    case "tool_execution_end":
      return sse("tool_end", {
        id: event.toolCallId,
        name: event.toolName,
        result: String(event.result?.content?.[0]?.text ?? "").slice(0, 500),
        isError: event.isError ?? false,
      });
    default:
      return null;
  }
}

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, "public")));

let busy = false;

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    model: `${model.provider}/${model.id}`,
    busy,
  });
});

app.post("/chat", async (req, res) => {
  const message = req.body?.message;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message required" });
  }
  if (busy) {
    return res.status(429).json({ error: "Agent busy, retry shortly" });
  }

  busy = true;
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders?.();

  const off = session.subscribe((event) => {
    const payload = translateEvent(event as Parameters<typeof translateEvent>[0]);
    if (!payload) return;
    try {
      res.write(payload);
    } catch {
      /* client gone */
    }
  });

  let settled = false;
  // Use response close — request 'close' often fires when the POST body finishes,
  // which would abort the agent immediately.
  res.on("close", () => {
    off();
    if (!settled) {
      void session.abort().catch(() => undefined);
    }
  });

  try {
    await session.prompt(message);
  } catch (err) {
    const messageText = err instanceof Error ? err.message : "Agent error";
    try {
      res.write(sse("error", { message: messageText }));
    } catch {
      /* client gone */
    }
  } finally {
    settled = true;
    off();
    try {
      res.write(sse("done", {}));
    } catch {
      /* client gone */
    }
    res.end();
    busy = false;
  }
});

const server = app.listen(PORT, () => {
  console.log(`DataAgent SSE → http://localhost:${PORT}`);
  console.log(`model: ${model.provider}/${model.id}`);
  console.log(`try: 华东地区笔记本卖了多少？`);
});

process.on("SIGINT", () => {
  console.log("\nshutting down…");
  session.dispose();
  server.close(() => process.exit(0));
});
