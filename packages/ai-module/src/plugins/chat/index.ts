import type { AiPlugin } from "../../platform";
import { chatManifest } from "./manifest";
import { ChatView } from "./ChatView";

export const chatPlugin: AiPlugin = {
  manifest: chatManifest,
  View: ChatView,
};
