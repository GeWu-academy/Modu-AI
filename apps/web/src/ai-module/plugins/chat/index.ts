import type { AiPlugin } from "../../platform/index";
import { chatManifest } from "./manifest";
import { ChatView } from "./ChatView";

export const chatPlugin: AiPlugin = {
  manifest: chatManifest,
  View: ChatView,
};
