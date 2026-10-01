# Lab 03 — ModelRuntime

对应教程 P03 / [第 3 章](https://github.com/buchidonggua/dg-ai-notes/blob/main/pi-agent/pi_sdk_learn/docs/第3章-模型配置的关键-判断企业内网能否接入.md)。

## 跑

```bash
export PI_CODING_AGENT_DIR=$PWD/config/agent
npm run lab:03
```

## 会看到什么

1. `getAvailable()` 列出有 Key 的模型  
2. `getModel(provider, id)` 打印模型元数据（同步，不校验 Key）  
3. 用第一个模型 `prompt` 一次（`SessionManager.inMemory()`，不落盘）  
4. 若有 ≥2 个可用模型，再 `setModel` 切换后 `prompt`（历史保留）

## 想练 setModel

在 `config/agent/models.json` 的同一 Provider（或新 Provider）再加一个有 Key 的模型，例如：

```json
"models": [
  { "id": "gpt-4.1-mini", "name": "GPT-4.1 Mini" },
  { "id": "gpt-4o-mini", "name": "GPT-4o Mini" }
]
```

## 内网 / 自定义端点核对（笔记用）

见 `docs/notes/practice/P03.md` 核对清单。硬性门槛（`openai-completions`）：

1. `POST {baseUrl}/chat/completions`（`baseUrl` 只写到 `/v1`）  
2. 必须支持 SSE `stream: true`  
3. 鉴权通常为 `Authorization: Bearer …`
