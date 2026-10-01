# Lab 03 — DeepSeek Harness 冒烟

目标：在本机把 `dsh` 跑起来，建立与 Pi labs 对照的「最小可运行」基线。

> Developer preview：先读 [SAFETY.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/SAFETY.md)。

## 方式 A · npm（最快）

```bash
# 从仓库根目录
npm run lab:03:help    # 确认 CLI
npm run lab:03:web     # 启动 Web UI（默认 http://127.0.0.1:3080，--no-open）
```

## 方式 B · 源码（对照架构）

```bash
npm run vendor:clone:dsh
cd vendor/deepseek-harness
pnpm install
pnpm run build
pnpm dsh web --no-open
```

架构入口：`vendor/deepseek-harness/docs/architecture.md`（或 [线上](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)）。

## 对照任务（写进笔记）

做完后填写 `docs/notes/compare/C01.md` 与 `C05.md`：

1. 启动后你看到的产品面（Web / profile）与 Pi CLI/TUI 差在哪？  
2. `dsh --profile web --dump-config`（若可用）里，哪些是 bundle / plugin 层？  
3. 和 `npm run lab:01` 的「一个 session.prompt」相比，扩展入口分别落在哪一层？
