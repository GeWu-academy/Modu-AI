import type { AiPlugin } from "../platform";
import { chatPlugin } from "./chat";

/** Business plugins. Add qa / report here as they land. */
export const builtinPlugins: AiPlugin[] = [chatPlugin];
