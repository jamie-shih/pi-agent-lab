# Labs

可运行的 TypeScript 实验，对齐 [dg-ai-notes](https://github.com/buchidonggua/dg-ai-notes) 实战上手路径，API 以官方 [`@earendil-works/pi-coding-agent`](https://www.npmjs.com/package/@earendil-works/pi-coding-agent) 为准。

| Lab | 命令 | 对应教程 | 目的 |
|-----|------|----------|------|
| 01-hello | `npm run lab:01` | P01 环境部署 | 跑通 SDK + 模型配置 |
| 02-session-events | `npm run lab:02` | P02 / M03·M07 | 观察会话事件流 |

后续可按教程自行追加：模型管理、系统提示词、自定义工具、扩展/事件守卫、SSE 服务封装。

## 前置

1. Node.js ≥ 22.19
2. `npm install`
3. 配置模型（二选一）
   - `npm run setup:config` 后编辑 `config/agent/models.json`，并 `export PI_CODING_AGENT_DIR=$PWD/config/agent`
   - 或使用本机 `~/.pi/agent/models.json`
