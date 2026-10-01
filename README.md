# pi-agent-lab

个人学习实验室：研读并对照两套 Agent Harness——

- [earendil-works/pi](https://github.com/earendil-works/pi)（Pi）— 按 [dg-ai-notes](https://github.com/buchidonggua/dg-ai-notes) 双轨教程推进  
- [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）— 「一切皆插件」/ Cordis  

在线阅读（Pi 教程）：[dg-ai-notes.pages.dev](https://dg-ai-notes.pages.dev)  
DSH 文档：[deepseek-harness.github.io](https://deepseek-harness.github.io/deepseek-harness/)  
对照总表：[docs/compare/pi-vs-deepseek-harness.md](./docs/compare/pi-vs-deepseek-harness.md)

## 仓库结构

```
pi-agent-lab/
├── labs/                 # 可运行实验（Pi SDK + DSH 冒烟）
├── config/agent/         # 可选：Pi 项目内模型配置模板
├── docs/
│   ├── learning-path.md  # 章节地图（含对照轨）
│   ├── compare/          # Pi ↔ DeepSeek Harness 对照
│   ├── references.md
│   └── notes/            # 个人笔记模板（practice / source-dive / compare）
├── scripts/              # 配置与 vendor clone
└── vendor/               # （gitignore）浅克隆上游源码
```

## 快速开始

需要 **Node.js ≥ 22.19**。

```bash
npm install
npm run setup:config
# 编辑 config/agent/models.json，填入可用 Provider / API Key
export PI_CODING_AGENT_DIR=$PWD/config/agent

npm run lab:01        # Pi：最小会话
npm run lab:02        # Pi：观察 session 事件
npm run lab:03        # Pi：ModelRuntime / 切模型
npm run lab:04a       # Pi：替换系统提示词人设
npm run lab:04b       # Pi：分层拼装提示词
npm run lab:05        # Pi：自定义工具 query_data
npm run lab:06a       # Pi：扩展拦截过大 limit
npm run lab:06b       # Pi：扩展事件全景
npm run lab:dsh:help  # DSH：确认 CLI（会拉取 @deepseek-ai/dsh）
# npm run lab:dsh:web # DSH：Web UI（先读上游 SAFETY.md）
```

也可使用本机 `~/.pi/agent/` 配置（与官方 `pi` CLI 相同）。

对照读源码：

```bash
npm run vendor:clone   # vendor/pi + vendor/deepseek-harness
```

## 学习怎么走

详见 [docs/learning-path.md](./docs/learning-path.md)。

| 轨道 | 内容 | 入口 |
|------|------|------|
| 实战上手 P01–P07 | Pi DataAgent 路线 | [在线版](https://dg-ai-notes.pages.dev) · `labs/` · `docs/notes/practice/` |
| 源码精读 M01–M10 | Pi Agent Loop / 工具 / 会话 | [TS 目录](https://github.com/buchidonggua/dg-ai-notes/tree/main/pi-agent/pi_source_dive/typescript) · `docs/notes/source-dive/` |
| 对照学习 C01–C06 | Pi ↔ DeepSeek Harness | [对照总表](./docs/compare/pi-vs-deepseek-harness.md) · `docs/notes/compare/` · `labs/03-dsh-smoke/` |

## 当前依赖

Pi SDK（可按需升级）：

- `@earendil-works/pi-coding-agent@0.99.2`
- `@earendil-works/pi-agent-core@0.99.2`
- `@earendil-works/pi-ai@0.99.2`

DeepSeek Harness 通过 `npx @deepseek-ai/dsh` 或 `vendor/deepseek-harness` 使用（开发者预览，API 可能破坏兼容）。

## 致谢

- [earendil-works/pi](https://github.com/earendil-works/pi) — Pi Agent Harness  
- [buchidonggua/dg-ai-notes](https://github.com/buchidonggua/dg-ai-notes) — Pi 源码解读与二次开发实战  
- [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) — DeepSeek Harness（`dsh`）

本仓库不镜像教程全文；笔记模板供个人填写。教程文档遵循其仓库声明的许可。

## License

本仓库原创代码与笔记模板：MIT（见 [LICENSE](./LICENSE)）。
