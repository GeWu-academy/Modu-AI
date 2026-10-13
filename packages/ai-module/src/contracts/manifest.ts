import type { PermissionId } from "./permissions";

export interface PluginNavEntry {
  label: string;
  path: string;
  order: number;
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  category: "ai-module";
  platforms: ("admin" | "playground")[];
  dependencies: string[];
  permissions: PermissionId[];
  nav: PluginNavEntry;
  /** Report-style plugins may set this to run through the backend async queue. */
  async?: boolean;
}
