# pi-agent-lab

个人学习实验室：研读 [earendil-works/pi](https://github.com/earendil-works/pi)（Pi Agent Harness），并按 [buchidonggua/dg-ai-notes](https://github.com/buchidonggua/dg-ai-notes) 的双轨教程推进——**先实战上手，再源码精读**。

在线阅读（推荐）：[dg-ai-notes.pages.dev](https://dg-ai-notes.pages.dev)

## 仓库结构

```
pi-agent-lab/
├── labs/                 # 可运行实验（TypeScript）
├── config/agent/         # 可选：项目内模型配置模板
├── docs/
│   ├── learning-path.md  # 章节地图与上游链接
│   ├── references.md
│   └── notes/            # 个人学习笔记模板
├── scripts/              # 本地配置辅助
└── vendor/               # （gitignore）自行 clone 的官方源码
```

## 快速开始

需要 **Node.js ≥ 22.19**。

```bash
npm install
npm run setup:config
# 编辑 config/agent/models.json，填入可用 Provider / API Key
export PI_CODING_AGENT_DIR=$PWD/config/agent

npm run lab:01   # 最小会话烟雾测试
npm run lab:02   # 观察 session 事件流
```

也可使用本机 `~/.pi/agent/` 配置（与官方 `pi` CLI 相同）。

## 学习怎么走

详见 [docs/learning-path.md](./docs/learning-path.md)。

| 轨道 | 内容 | 入口 |
|------|------|------|
| 实战上手 P01–P07 | DataAgent 路线：环境 → 工具 → 上线 | [在线版](https://dg-ai-notes.pages.dev) · 本仓库 `labs/` + `docs/notes/practice/` |
| 源码精读 M01–M10 | Agent Loop / 工具 / 上下文 / 会话 | [TS 目录](https://github.com/buchidonggua/dg-ai-notes/tree/main/pi-agent/pi_source_dive/typescript) · `docs/notes/source-dive/` |

对照官方源码：

```bash
git clone --depth 1 https://github.com/earendil-works/pi.git vendor/pi
```

## 当前依赖

锁定与官方近期发布一致的 workspace 版本（可按需升级）：

- `@earendil-works/pi-coding-agent@0.99.2`
- `@earendil-works/pi-agent-core@0.99.2`
- `@earendil-works/pi-ai@0.99.2`

教程示例若标注更旧版本（例如 `v0.83.0`），以本仓库 `package.json` 与官方类型定义为准，边学边核对 API 差异。

## 致谢

- [earendil-works/pi](https://github.com/earendil-works/pi) — Pi Agent Harness
- [buchidonggua/dg-ai-notes](https://github.com/buchidonggua/dg-ai-notes) — Pi 源码解读与二次开发实战

本仓库不镜像教程全文；笔记模板供个人填写。教程文档遵循其仓库声明的 CC-BY-SA-4.0。

## License

本仓库原创代码与笔记模板：MIT（见 [LICENSE](./LICENSE)）。
