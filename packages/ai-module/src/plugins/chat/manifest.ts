import type { PluginManifest } from "../../contracts/index.js";

export const chatManifest: PluginManifest = {
  id: "ai.chat",
  name: "对话助手",
  version: "0.0.0",
  description: "基于已配置 Provider 的多轮对话，用于验证底座调用与流式渲染。",
  category: "ai-module",
  platforms: ["admin", "playground"],
  dependencies: [],
  permissions: ["ai.chat.use"],
  nav: { label: "对话助手", path: "/ai/chat", order: 10 },
};
