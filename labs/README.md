# Labs

可运行实验。Pi 对齐 [dg-ai-notes](https://github.com/buchidonggua/dg-ai-notes) 实战路径；DSH 对齐 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 冒烟与对照。

| Lab | 命令 | 对应 | 目的 |
|-----|------|------|------|
| 01-hello | `npm run lab:01` | Pi P01 | 跑通 Pi SDK + 模型配置 |
| 02-session-events | `npm run lab:02` | Pi P02 / M03·M07 | 观察 Pi session 事件流 |
| 03-model-runtime | `npm run lab:03` | Pi P03 | ModelRuntime：列表 / getModel / setModel |
| 04-system-prompt | `npm run lab:04a` / `lab:04b` | Pi P04 | 覆盖默认人设；分层拼装提示词 |
| 05-tools | `npm run lab:05` | Pi P05 | `defineTool` + `query_data` 查 CSV |
| 06-extensions | `npm run lab:06a` / `lab:06b` | Pi P06 | `tool_call` 拦截；扩展事件全景 |
| 03-dsh-smoke | `npm run lab:dsh:help` / `lab:dsh:web` | 对照 C01·C05 | DeepSeek Harness CLI / Web 冒烟 |

后续可按 Pi 教程追加：模型管理、系统提示词、自定义工具、扩展/事件守卫、SSE 服务封装。

## 前置（Pi Labs）

1. Node.js ≥ 22.19
2. `npm install`
3. 配置模型（二选一）
   - `npm run setup:config` 后编辑 `config/agent/models.json`，并 `export PI_CODING_AGENT_DIR=$PWD/config/agent`
   - 或使用本机 `~/.pi/agent/models.json`

## 前置（DSH Lab）

1. 阅读 [SAFETY.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/SAFETY.md)
2. `npm run lab:03:help` 会经 npx 拉取 `@deepseek-ai/dsh`
3. 源码对照：`npm run vendor:clone:dsh`
