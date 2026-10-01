# Pi vs DeepSeek Harness

对照学习两套 **Agent Harness**：设计假设不同，但关心的问题高度重叠（loop、工具、会话、扩展）。

| | [Pi](https://github.com/earendil-works/pi) | [DeepSeek Harness (`dsh`)](https://github.com/deepseek-ai/deepseek-harness) |
|--|--|--|
| 定位 | 精简可扩展的 coding agent + SDK 分层（`pi-ai` / `pi-agent-core` / `pi-coding-agent`） | 「一切皆插件」的完整产品 harness，Cordis 驱动 |
| 运行时核心 | Agent session + tool calling + 扩展/事件 | Cordis plugin tree：profile + bundle + patch |
| 扩展模型 | Extension API / 事件订阅 / skills | Plugin 挂载、`agent/*`·`tools/*`·`session/event`、capability seam |
| 会话 | SessionManager / 会话条目与 compaction | Append-only `SessionEvent` log；`deriveMessages()` 投影模型历史 |
| UI | TUI（`pi-tui`）为主；另有 web-ui 包 | Web UI（默认 `3080`）、Desktop、ACP、headless、SDK profile |
| 包管理 | npm workspace；CLI `@earendil-works/pi-coding-agent` | pnpm monorepo；CLI `@deepseek-ai/dsh` |
| 成熟度提示 | 生产向 SDK + coding agent | Developer preview，**可能破坏兼容** |
| 文档入口 | [pi.dev](https://pi.dev) · [dg-ai-notes](https://dg-ai-notes.pages.dev) | [官方文档](https://deepseek-harness.github.io/deepseek-harness/) · [architecture](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) |

## 概念对照（读源码时用）

| 你想理解的问题 | 先看 Pi | 再看 DeepSeek Harness |
|----------------|---------|------------------------|
| 一次对话怎么转起来 | Agent Loop / `createAgentSession` | `core/agent-loop`、turn/step 流（`docs/architecture.md`） |
| 模型怎么接 | `pi-ai`、`ModelRuntime` | `ctx.llm` adapter、`llm/stream` |
| 工具怎么注册与拦截 | tools + extension 事件 | `ctx.tools`、`tools/pre-execute|execute|post-execute` |
| 上下文 / 压缩 | compaction、上下文工程章节 | session log 投影、`packages/compaction` |
| 会话存取与分叉 | SessionManager | Session persistence + fork at turn boundary |
| 产品形态怎么组装 | coding-agent CLI + extensions | profile（`web` / `headless` / `sdk` / `acp`）+ bundle |

## 建议学习顺序

1. **Pi 实战 P01–P02**（本仓库 `labs/`）— 先有一个最小可跑会话  
2. **DeepSeek 冒烟** — `npx @deepseek-ai/dsh web --no-open` 或 clone 后 `pnpm dsh web`（先读 [SAFETY](https://github.com/deepseek-ai/deepseek-harness/blob/master/SAFETY.md)）  
3. **对照笔记 C01–C06** — `docs/notes/compare/`  
4. **两边源码精读** — `vendor/pi` 与 `vendor/deepseek-harness`（`npm run vendor:clone`）

## 本地源码

```bash
npm run vendor:clone          # 浅克隆 pi + deepseek-harness 到 vendor/
# 或单独：
npm run vendor:clone:pi
npm run vendor:clone:dsh
```

`vendor/` 已 gitignore，不进本仓库。
