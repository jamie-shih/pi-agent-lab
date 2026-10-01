# 学习路径

本 lab 三条轨道：**Pi 实战** → **Pi 源码** → **与 DeepSeek Harness 对照**。不复制教程正文；正文读在线版或上游仓库。

## 推荐顺序

1. **Pi 实战（P01–P07）** — 搭出一个可运行的垂直 Agent  
2. **Pi 源码（M01–M10）** — 理解 Agent Loop、工具、消息、上下文、会话  
3. **对照（C01–C06）** — 同一问题在 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 里怎么解  

对照总表：[compare/pi-vs-deepseek-harness.md](./compare/pi-vs-deepseek-harness.md)

在线阅读（Pi）：https://dg-ai-notes.pages.dev  
上游笔记：https://github.com/buchidonggua/dg-ai-notes  
Pi 源码：https://github.com/earendil-works/pi  
DSH 源码 / 文档：https://github.com/deepseek-ai/deepseek-harness · https://deepseek-harness.github.io/deepseek-harness/

## 实战上手 · 7 章（Pi）

| ID | 主题 | 本仓库对应 |
|----|------|------------|
| P01 | 环境部署 | `labs/01-hello` |
| P02 | 工作机制 / 核心 API | `labs/02-session-events` + `docs/notes/practice/P02.md` |
| P03 | 模型配置关键点 | `labs/03-model-runtime` + `docs/notes/practice/P03.md` |
| P04 | 系统提示词 | `labs/04-system-prompt` + `docs/notes/practice/P04.md` |
| P05 | 定义工具 | `docs/notes/practice/P05.md` |
| P06 | 事件监听 / 扩展 | `docs/notes/practice/P06.md` |
| P07 | 封装成服务 | `docs/notes/practice/P07.md` |

教程目录：https://github.com/buchidonggua/dg-ai-notes/tree/main/pi-agent/pi_sdk_learn/docs  

配套示例代码（上游）：https://github.com/buchidonggua/dg-ai-notes/tree/main/pi-agent/pi_sdk_learn/code  

## 源码精读 · 10 章（Pi）

| ID | 主题 | 笔记模板 |
|----|------|----------|
| M01 | 框架总览 | `docs/notes/source-dive/M01.md` |
| M02 | 三层架构 | `docs/notes/source-dive/M02.md` |
| M03 | Agent Loop | `docs/notes/source-dive/M03.md` |
| M04 | 模型调用 | `docs/notes/source-dive/M04.md` |
| M05 | 工具系统 | `docs/notes/source-dive/M05.md` |
| M06 | 消息系统 | `docs/notes/source-dive/M06.md` |
| M07 | 事件驱动 | `docs/notes/source-dive/M07.md` |
| M08 | 上下文工程 | `docs/notes/source-dive/M08.md` |
| M09 | 上下文压缩 | `docs/notes/source-dive/M09.md` |
| M10 | 会话管理 | `docs/notes/source-dive/M10.md` |

TS 版：https://github.com/buchidonggua/dg-ai-notes/tree/main/pi-agent/pi_source_dive/typescript  

Python 版：https://github.com/buchidonggua/dg-ai-notes/tree/main/pi-agent/pi_source_dive/python  

## 对照学习 · 6 章（Pi ↔ DeepSeek Harness）

| ID | 主题 | 笔记 / Lab |
|----|------|------------|
| C01 | 定位与架构假设 | `docs/notes/compare/C01.md` |
| C02 | Agent Loop 与 Turn/Step | `docs/notes/compare/C02.md` |
| C03 | 工具系统与扩展点 | `docs/notes/compare/C03.md` |
| C04 | 会话与上下文 | `docs/notes/compare/C04.md` |
| C05 | 产品组装（CLI / UI / SDK） | `docs/notes/compare/C05.md` · `labs/03-dsh-smoke` |
| C06 | 何时选谁 | `docs/notes/compare/C06.md` |

DSH 架构精读入口：https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md  

运行前请读安全说明：https://github.com/deepseek-ai/deepseek-harness/blob/master/SAFETY.md  

## 本地对照官方源码

```bash
npm run vendor:clone          # pi + deepseek-harness
npm run vendor:clone:pi
npm run vendor:clone:dsh
```

### Pi 重点包

- `packages/ai` → `@earendil-works/pi-ai`
- `packages/agent` → `@earendil-works/pi-agent-core`
- `packages/coding-agent` → `@earendil-works/pi-coding-agent`
- `packages/tui` → `@earendil-works/pi-tui`

### DeepSeek Harness 重点

- `packages/core/agent-loop` · `packages/core/tools` · `packages/core/session`
- `packages/llm` · `packages/bundle/*` · `packages/sdk`
- `docs/architecture.md` · Cordis primer / tutorial

## Skill（可选，Pi）

教程同步维护的 `dg-piagent` skill：  
https://github.com/buchidonggua/dg-ai-notes/tree/main/skills/dg-piagent  

下载后放进你使用的 agent skills 目录即可。
