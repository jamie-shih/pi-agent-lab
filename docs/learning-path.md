# 学习路径

本 lab 跟着双轨教程走，不复制教程正文；正文请读在线版或上游仓库。

## 推荐顺序

1. **先实战（P01–P07）** — 搭出一个可运行的垂直 Agent  
2. **再源码（M01–M10）** — 理解 Agent Loop、工具、消息、上下文、会话  

在线阅读（推荐）：https://dg-ai-notes.pages.dev  

上游笔记仓库：https://github.com/buchidonggua/dg-ai-notes  

官方源码：https://github.com/earendil-works/pi  

## 实战上手 · 7 章

| ID | 主题 | 本仓库对应 |
|----|------|------------|
| P01 | 环境部署 | `labs/01-hello` |
| P02 | 工作机制 / 核心 API | `labs/02-session-events` + `docs/notes/practice/P02.md` |
| P03 | 模型配置关键点 | `docs/notes/practice/P03.md` |
| P04 | 系统提示词 | `docs/notes/practice/P04.md` |
| P05 | 定义工具 | `docs/notes/practice/P05.md` |
| P06 | 事件监听 / 扩展 | `docs/notes/practice/P06.md` |
| P07 | 封装成服务 | `docs/notes/practice/P07.md` |

教程目录：https://github.com/buchidonggua/dg-ai-notes/tree/main/pi-agent/pi_sdk_learn/docs  

配套示例代码（上游）：https://github.com/buchidonggua/dg-ai-notes/tree/main/pi-agent/pi_sdk_learn/code  

## 源码精读 · 10 章

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

## 本地对照官方源码

```bash
git clone --depth 1 https://github.com/earendil-works/pi.git vendor/pi
```

重点包：

- `packages/ai` → `@earendil-works/pi-ai`
- `packages/agent` → `@earendil-works/pi-agent-core`
- `packages/coding-agent` → `@earendil-works/pi-coding-agent`
- `packages/tui` → `@earendil-works/pi-tui`

## Skill（可选）

教程同步维护的 `dg-piagent` skill：  
https://github.com/buchidonggua/dg-ai-notes/tree/main/skills/dg-piagent  

下载后放进你使用的 agent skills 目录即可。
