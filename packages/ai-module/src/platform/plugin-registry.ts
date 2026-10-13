import type { ComponentType } from "react";
import type { HostAdapter, PluginManifest } from "../contracts/index.js";

export interface PluginViewProps {
  host: HostAdapter;
}

export interface AiPlugin {
  manifest: PluginManifest;
  View: ComponentType<PluginViewProps>;
}

export interface PluginRegistry {
  register(plugin: AiPlugin): void;
  list(): AiPlugin[];
  listEnabled(host: HostAdapter): AiPlugin[];
}

export function createPluginRegistry(): PluginRegistry {
  const plugins: AiPlugin[] = [];
  return {
    register(plugin) {
      if (plugins.some((existing) => existing.manifest.id === plugin.manifest.id)) {
        throw new Error(`Duplicate plugin id: ${plugin.manifest.id}`);
      }
      plugins.push(plugin);
    },
    list() {
      return [...plugins].sort((a, b) => a.manifest.nav.order - b.manifest.nav.order);
    },
    listEnabled(host) {
      return this.list().filter((plugin) =>
        plugin.manifest.permissions.every((permission) => host.can(permission)),
      );
    },
  };
}
