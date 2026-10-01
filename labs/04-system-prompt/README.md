# Lab 04 — 系统提示词

对应教程 P04 / [第 4 章](https://github.com/buchidonggua/dg-ai-notes/blob/main/pi-agent/pi_sdk_learn/docs/第4章-系统提示词-必须覆盖默认Agent人设.md)。  
动哪一层：**Runtime · ResourceLoader**。

## 跑

```bash
export PI_CODING_AGENT_DIR=$PWD/config/agent
npm run lab:04a   # 代码层完全替换人设
npm run lab:04b   # 文件 + 用户上下文拼装
npm run lab:04b -- u002   # 换用户（财务）
```

## 要点

最终系统提示词五段拼装：① 基础人设 → ② 追加规则 → ③ 项目上下文 → ④ 技能 → ⑤ cwd 一行。

垂直 Agent **必须管 ①**：

| 优先级 | 来源 |
|--------|------|
| 1 | `systemPromptOverride`（本 lab） |
| 2 | `{cwd}/.pi/SYSTEM.md` |
| 3 | SDK 硬编码 coding assistant |

`appendSystemPromptOverride: () => []` 清空 ②，避免 APPEND 文件干扰。  
⑤ `Current working directory` 无直接开关；要剥掉可用 `before_agent_start`（P06）。

对比：Lab 01 默认人设会自称 coding assistant；04a 应出现「作为数据分析助手…」。
