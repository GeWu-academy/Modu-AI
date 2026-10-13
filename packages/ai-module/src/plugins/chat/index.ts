import type { AiPlugin } from "../../platform/index.js";
import { chatManifest } from "./manifest.js";
import { ChatView } from "./ChatView.js";

export const chatPlugin: AiPlugin = {
  manifest: chatManifest,
  View: ChatView,
};
