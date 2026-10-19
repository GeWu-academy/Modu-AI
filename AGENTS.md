# Repository Guidelines

## 工作方式（Small-MVP 与变更记录）

- 每个独立任务（讨论、文档、实现、调查、修复）都按小 MVP 处理：定义目标与范围、记录计划、做最小完整改动、验证、记录结果。
- 变更记录按日期归档：`changes/<date>/NN-short-topic/`（如 `changes/2026-10-13/01-initial-scaffold/`）。同一目标沿用同一目录，新目标才新建目录。
- 每个任务目录包含 `plan.md`（含日期与背景、目标与最小交付、包含/排除范围、决策与开放问题、预计文件变更、步骤、验收与验证方法）与 `result.md`（状态、任务清单、实际变更文件、验证命令与结果、偏差/阻塞/遗留/后续建议）。
- 未验证的项不勾选完成；区分通过、失败、未运行、阻塞、不适用。
- 根 `changes/` 目录本地专用，不提交、不强制加入版本控制。

## 技术基线

- 前端：TypeScript + React 19 + Next.js（App Router，部署 Vercel），唯一应用为 `apps/web`。
- 服务端状态用 TanStack Query，客户端状态用 Zustand（引入时遵循）。
- 后端逻辑归属 Modu 的 `apps/api/internal/modules/ai`（Go + Gin + GORM + PostgreSQL + Redis + Asynq）；本仓库不承载后端（临时例外：`apps/web` 内 Route Handlers 提供占位 AI 接口，Modu 后端就绪后移除）。
- 契约（类型、manifest、HostAdapter、API DTO）以 `apps/web/src/ai-module/contracts` 为源头，同步进 Modu 的 `apps/api/api/openapi.yaml` 与前端适配层。

## 架构边界

- 模块核心代码（`src/ai-module` 的 contracts / platform / plugins）绝不 import 宿主内部模块，只依赖 `HostAdapter` 契约。
- 插件之间不互相 import，只依赖契约层与底座公开 API。
- 密钥等敏感信息前端脱敏显示；真实值仅在后端加密存储；不得写入源码、日志、变更记录。
- 不做运行时热加载；插件随应用构建、静态注册。

## 安全与数据

- 不在源码、日志、测试夹具、变更记录中放置凭据或真实敏感数据；示例用占位符。
- 工具调用白名单；不执行外部导入内容中的脚本、SQL 或命令。

## 本地专用目录

- `apps/web` 为可部署的独立 Next.js 应用（Vercel，Root Directory 选 `apps/web`），包含并入的 AI 模块源码（`src/ai-module`）。
- `changes/` 本地专用，不提交、不强制加入版本控制。
