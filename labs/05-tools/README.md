# Lab 05 — 定义工具

对应教程 P05 / [第 5 章](https://github.com/buchidonggua/dg-ai-notes/blob/main/pi-agent/pi_sdk_learn/docs/第5章-定义工具-从功能到交互pi都想到了.md)。  
动哪一层：**Tool**（经 `customTools` 注入；垂直场景用 `noTools: "builtin"` 藏默认工具）。

## 跑

```bash
export PI_CODING_AGENT_DIR=$PWD/config/agent
npm run lab:05
```

## 你会看到

1. `[tool] query_data`（`tool_execution_start`）  
2. Agent 用 CSV 结果汇总华东销售额  
3. 可能出现第二轮 `turn_*`（先工具后回答）— 对照 P02 的单 turn

## 三件套

1. **说明书**：`name` / `label` / `description` / `parameters`（TypeBox）  
2. **干活**：`execute` → `{ content, details }`  
3. **注册**：`customTools: [queryDataTool]`

数据：`shared/data/sales.csv` · 过滤逻辑：`shared/query-sales.ts`
