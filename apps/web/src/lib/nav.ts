import { builtinPlugins } from "@/ai-module";

export interface NavItem {
  label: string;
  path: string;
  order: number;
  pluginId?: string;
}

export const PROVIDERS_PATH = "/ai/providers";

const platformNav: NavItem[] = [{ label: "Provider 管理", path: PROVIDERS_PATH, order: 0 }];

const pluginNav: NavItem[] = builtinPlugins.map((plugin) => ({
  ...plugin.manifest.nav,
  pluginId: plugin.manifest.id,
}));

export const navSections: { title: string; items: NavItem[] }[] = [
  { title: "底座", items: platformNav },
  {
    title: "插件",
    items: [...pluginNav].sort((a, b) => a.order - b.order),
  },
];

export type AiRoute = { kind: "providers" } | { kind: "plugin"; pluginId: string };

/** Maps an /ai/* pathname to a page target; shared by the catch-all route. */
export function resolveAiRoute(path: string): AiRoute | null {
  if (path === PROVIDERS_PATH) {
    return { kind: "providers" };
  }
  const plugin = builtinPlugins.find((entry) => entry.manifest.nav.path === path);
  return plugin ? { kind: "plugin", pluginId: plugin.manifest.id } : null;
}
