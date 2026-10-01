# Lab 06 — 事件监听 / 扩展

对应教程 P06 / [第 6 章](https://github.com/buchidonggua/dg-ai-notes/blob/main/pi-agent/pi_sdk_learn/docs/第6章-事件监听-实现你的个性化需求.md)。  
动哪一层：**ExtensionRuntime**（`extensionFactories` + `pi.on`）。

## 跑

```bash
export PI_CODING_AGENT_DIR=$PWD/config/agent
npm run lab:06a   # tool_call 拦截过大 limit
npm run lab:06b   # 全景事件日志（无工具）
```

## 要点

| | `session.subscribe` | 扩展 `pi.on` |
|--|---------------------|--------------|
| 用途 | 观察 / UI / 打字机 | 可拦截、改参数、改结果 |
| 独有事件 | — | `tool_call` / `tool_result` / `before_agent_start` / `input` / `context` … |

06a：`return { block: true, reason }` 拦危险工具参数；`reason` 回流给 LLM。  
06b：对照 P02，看扩展层多出来的 `before_agent_start` / `input` / `context` 等。
