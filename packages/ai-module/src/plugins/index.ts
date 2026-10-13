import type { AiPlugin } from "../platform/index.js";
import { chatPlugin } from "./chat/index.js";

/** Business plugins. Add qa / report here as they land. */
export const builtinPlugins: AiPlugin[] = [chatPlugin];
