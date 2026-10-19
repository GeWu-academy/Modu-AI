"use client";

import { useMemo } from "react";
import { createModuAI } from "@/ai-module";
import { createWebHost } from "@/host/webHost";

export function PluginHostView({ pluginId }: { pluginId: string }) {
  const host = useMemo(() => createWebHost(), []);
  const app = useMemo(() => createModuAI(host), [host]);
  const plugin = app.plugins.listEnabled(host).find((entry) => entry.manifest.id === pluginId);

  if (!plugin) {
    return (
      <section className="panel">
        <h2>插件不可用</h2>
        <p className="muted">插件 {pluginId} 不存在或当前身份无权限。</p>
      </section>
    );
  }

  return <plugin.View host={host} />;
}
