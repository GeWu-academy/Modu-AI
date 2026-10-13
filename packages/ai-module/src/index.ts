import type { HostAdapter, PluginNavEntry } from "./contracts/index.js";
import {
  createPluginRegistry,
  createProviderRegistry,
  type PluginRegistry,
  type ProviderRegistry,
} from "./platform/index.js";
import { builtinPlugins } from "./plugins/index.js";

export interface ModuAiApp {
  host: HostAdapter;
  providers: ProviderRegistry;
  plugins: PluginRegistry;
  navEntries: (PluginNavEntry & { pluginId: string })[];
}

/** Boots the AI platform against a host and registers the built-in plugins. */
export function createModuAI(host: HostAdapter): ModuAiApp {
  const plugins = createPluginRegistry();
  for (const plugin of builtinPlugins) {
    plugins.register(plugin);
  }
  return {
    host,
    providers: createProviderRegistry(),
    plugins,
    navEntries: plugins.listEnabled(host).map((plugin) => ({
      ...plugin.manifest.nav,
      pluginId: plugin.manifest.id,
    })),
  };
}

export * from "./contracts/index.js";
export * from "./platform/index.js";
export * from "./plugins/index.js";
export type { AiPlugin } from "./platform/index.js";
