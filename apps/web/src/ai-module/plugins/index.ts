import type { AiPlugin } from "../platform/index";
import { chatPlugin } from "./chat/index";

/** Business plugins. Add qa / report here as they land. */
export const builtinPlugins: AiPlugin[] = [chatPlugin];
