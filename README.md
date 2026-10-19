# Modu-AI

Modu 的 AI 模块：以**独立 Next.js 应用**交付（`apps/web`），可整体部署到 Vercel；后端接口当前由应用内 Route Handlers 临时承接，后续切换到 Modu Go 后端。

## 定位

- **底座（platform）**：Provider 注册与解析、模型路由、会话/流式引擎、密钥引用、用量、插件注册表。
- **业务插件（plugins）**：对话助手（chat）、业务数据问答（qa）、报告生成（report）。
- **宿主适配（HostAdapter）**：模块核心不依赖具体宿主，宿主注入主题、身份、权限、API、通知等能力。
- **临时后端**：`apps/web/src/app/api/v1/ai/*` 占位接口（内存存储），后端正式归属 Modu `apps/api/internal/modules/ai`。

## 工程结构

```
Modu-AI/
└── apps/web/                     # 独立 Next.js 应用（App Router，Vercel 部署）
    └── src/
        ├── ai-module/            # AI 模块源码（contracts / platform / plugins）
        ├── app/                  # 路由：页面 + /api/v1/ai/* Route Handlers
        │   ├── page.tsx          # 首页（底座 + 插件入口）
        │   └── ai/[[...slug]]/    # /ai/providers、/ai/chat 等
        ├── components/           # 应用壳、Provider 管理、插件宿主视图、Toaster
        ├── host/webHost.ts       # 浏览器端 HostAdapter（fetch → /api/v1/ai）
        └── server/               # Route Handlers 的占位存储
```

`changes/` 为本地变更记录，不提交。

## 命令

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build          # 生产构建（.next）
pnpm start          # 运行生产构建
pnpm typecheck      # next typegen + tsc --noEmit
```

## 部署（Vercel）

1. Vercel → New Project → 导入本仓库。
2. **Root Directory 选 `apps/web`**（Framework 自动识别为 Next.js，Install/Build 无需改动）。
3. Deploy；无外部服务依赖，开箱可用。

切换到 Modu Go 后端时：设置环境变量 `NEXT_PUBLIC_MODU_API_BASE_URL`（如 `https://api.modu.example.com/v1/ai`）并移除占位 Route Handlers。

## 状态

- 底座（Provider 注册表/插件注册表）+ 首个插件（对话助手）+ 独立应用壳已就绪。
- Provider 管理页可创建/列出 Provider（占位内存存储）；对话走占位接口（未接真实模型与流式渲染）。
- 契约（类型、manifest、HostAdapter、API DTO）以 `apps/web/src/ai-module/contracts` 为源头，后续同步 Modu `apps/api/api/openapi.yaml`。
