# Lab 07 — SSE 服务

对应教程 P07 / [第 7 章](https://github.com/buchidonggua/dg-ai-notes/blob/main/pi-agent/pi_sdk_learn/docs/第7章-准备上线-把Agent封装成服务.md)。

把前几章攒下的 DataAgent（人设 + `query_data` + limit guard）封成 **进程内嵌 SDK + Express**，对外暴露与语言无关的 HTTP/SSE。

## 跑

```bash
export PI_CODING_AGENT_DIR=$PWD/config/agent
npm run lab:07
# 浏览器打开 http://localhost:3000
```

## 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/` | 静态聊天页 |
| GET | `/health` | `{ ok, model, busy }` |
| POST | `/chat` | body `{ message }`；响应为 SSE 事件流 |

SSE `data` JSON：`text` / `thinking` / `tool_start` / `tool_end` / `error` / `done`

## 关键点

- **单接口**：发消息与收流在同一 POST，天然对应
- `session.subscribe` → `translateEvent` → `res.write`
- 客户端断开 → 监听 **`res.on("close")`** 再 `session.abort()`（勿用 `req.on("close")`，POST body 读完会误触发）
- 单 session 防并发：`busy` → 429

## 无浏览器冒烟

```bash
curl -N -X POST http://localhost:3000/chat \
  -H 'content-type: application/json' \
  -d '{"message":"华东地区笔记本卖了多少？"}'
```
