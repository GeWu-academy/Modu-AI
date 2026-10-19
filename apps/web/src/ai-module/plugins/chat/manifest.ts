import type { PluginManifest } from "../../contracts/index";

export const chatManifest: PluginManifest = {
  id: "ai.chat",
  name: "对话助手",
  version: "0.1.0",
  description: "基于已配置 Provider 的多轮对话；后端当前由 Next.js Route Handler 占位，后续接入真实模型与流式渲染。",
  category: "ai-module",
  platforms: ["web"],
  dependencies: [],
  permissions: ["ai.chat.use"],
  nav: { label: "对话助手", path: "/ai/chat", order: 10 },
};
