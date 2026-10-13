# Modu-AI

Modu 的 AI 模块仓库：提供 AI 底座（模型提供商等基础设施），业务能力以可插拔插件形式交付。

## 定位

- **底座（platform）**：Provider 注册与解析、模型路由、会话/流式引擎、密钥引用、用量、插件注册表。
- **业务插件（plugins）**：对话助手（chat）、业务数据问答（qa）、报告生成（report）。
- **宿主适配（HostAdapter）**：核心不依赖宿主内部实现，宿主注入主题、身份、权限、API、通知等能力。

核心交付物是 `packages/ai-module`。

## 工程结构

```
Modu-AI/
├── packages/ai-module/     # 底座 + 业务插件，导出 createModuAI(host) —— 核心交付物
│   └── src/{contracts,platform,plugins,index.ts}
├── apps/remote/            # 可提交、可部署的 Module Federation remote（暴露 ./ModuAiRemote）
├── apps/playground/        # 本地开发壳（被 .gitignore 忽略，不提交）
├── changes/                # 变更记录（本地，勿提交）
└── docs/                   # 架构与插件契约（后续）
```

## 接入方式（运行时微前端）

`apps/remote` 构建为 Module Federation remote（`name: moduAi`，产物 `remoteEntry.js`），供 Modu 的 admin 在运行时加载其 `./ModuAiRemote` 组件——AI 代码不在 Modu 仓库。宿主通过 `context`（token/租户/权限/主题/API 基址）向远程模块注入能力。

## 命令

```bash
pnpm install
pnpm build            # 全仓库构建
pnpm typecheck        # 类型检查
pnpm dev:remote       # 本地运行 remote（:5001）
pnpm preview:remote   # 构建并预览 remote（:5001，带 CORS，供 admin 加载）
```

## 状态

- 核心包 + 首个插件（对话助手）+ 可部署 remote 已就绪。
- AI 后端为独立服务（未开始）；其访问 Modu 业务数据需经 Modu API（详见 Modu 侧变更记录）。

## 发布（npm 公共）

```bash
pnpm publish:module        # 构建并发布 @modu-ai/module
pnpm publish:module:dry    # 干跑
```

包入口与类型均指向 `dist`，`publishConfig.access=public` 支持 scoped 包公开发布。
