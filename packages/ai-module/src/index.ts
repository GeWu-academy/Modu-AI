import type { HostAdapter, PluginNavEntry } from "./contracts";
import {
  createPluginRegistry,
  createProviderRegistry,
  type PluginRegistry,
  type ProviderRegistry,
} from "./platform";
import { builtinPlugins } from "./plugins";

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

export * from "./contracts";
export * from "./platform";
export * from "./plugins";
export type { AiPlugin } from "./platform";
