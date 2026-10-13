# Modu-AI

Modu 的 AI 模块仓库：提供 AI 底座（模型提供商等基础设施），业务能力以可插拔插件形式交付。

## 定位

- **底座（platform）**：Provider 注册与解析、模型路由、会话/流式引擎、密钥引用、用量、插件注册表。
- **业务插件（plugins）**：对话助手（chat）、业务数据问答（qa）、报告生成（report）。
- **宿主适配（HostAdapter）**：核心不依赖宿主内部实现，宿主注入主题、身份、权限、API、通知等能力。
- **随用随插随弃**：构建期插拔（装卸依赖 + 删本地注册目录），不做运行时热加载。

核心交付物是 `packages/ai-module`。

## 工程结构

```
Modu-AI/
├── packages/ai-module/         # 底座 + 业务插件，导出 createModuAI(host) —— 核心交付物
│   └── src/{contracts,platform,plugins,index.ts}
├── apps/playground/            # 本地开发壳（不提交，仅本地测试用）
├── changes/                    # 变更记录（本地，勿提交）
└── docs/                       # 架构与插件契约（后续）
```

## 本地开发壳（不提交）

`apps/playground` 仅用于本地开发与测试，不是本仓库的核心功能，已由 `.gitignore`（`/apps/`）排除在版本控制之外，不会随仓库分发。

## 命令

```bash
pnpm install
pnpm dev         # 启动本地 playground（Vite）
pnpm build       # 构建核心包
pnpm typecheck   # 类型检查
```

## 状态

首版骨架：空底座 + 首个插件（对话助手）+ 本地 playground。后端逻辑归属 Modu 的 `apps/api/internal/modules/ai`，尚未开始。
