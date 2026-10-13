import { useMemo } from "react";
import { createModuAI, type HostAdapter, type PermissionId } from "@modu-ai/module";

export interface ModuAiHostContext {
  token?: string;
  userId?: string;
  tenantId?: string;
  displayName?: string;
  permissions?: PermissionId[];
  apiBaseUrl?: string;
  themeMode?: "light" | "dark";
}

const EMPTY_CONTEXT: ModuAiHostContext = {};

const DEFAULT_PERMISSIONS: PermissionId[] = [
  "ai.provider.read",
  "ai.provider.write",
  "ai.chat.use",
  "ai.qa.use",
  "ai.report.run",
];

function createHost(context: ModuAiHostContext): HostAdapter {
  const granted = new Set<PermissionId>(context.permissions ?? DEFAULT_PERMISSIONS);
  return {
    name: "admin-remote",
    getTheme: () => ({ mode: context.themeMode ?? "light", tokens: {} }),
    getIdentity: () => ({
      userId: context.userId ?? "anonymous",
      tenantId: context.tenantId ?? "unknown",
      displayName: context.displayName ?? "未登录",
    }),
    can: (permissionId) => granted.has(permissionId),
    apiClient: {
      baseUrl: context.apiBaseUrl ?? "/api/v1/ai",
      request: async () => {
        throw new Error("远程 AI 模块尚未接入后端");
      },
    },
    notifications: {
      notify: ({ message }) => console.log(`[modu-ai] ${message}`),
      confirm: async () => window.confirm("确认执行该操作？"),
    },
  };
}

export function ModuAiRemote({ context = EMPTY_CONTEXT }: { context?: ModuAiHostContext }) {
  const host = useMemo<HostAdapter>(() => createHost(context), [context]);
  const app = useMemo(() => createModuAI(host), [host]);
  const plugins = app.plugins.listEnabled(host);
  const identity = host.getIdentity();

  return (
    <div
      data-modu-ai-remote
      style={{
        border: "1px solid #d4d4d8",
        borderRadius: 12,
        padding: 16,
        fontFamily: "system-ui, sans-serif",
        background: "#ffffff",
        color: "#18181b",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 16 }}>Modu-AI（远程模块 / Module Federation）</div>
      <div style={{ color: "#71717a", fontSize: 13, margin: "4px 0 12px" }}>
        宿主：{host.name} · 用户：{identity.displayName} · 租户：{identity.tenantId} · 插件：
        {plugins.length}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {plugins.map((plugin) => (
          <span
            key={plugin.manifest.id}
            style={{
              border: "1px solid #e4e4e7",
              borderRadius: 999,
              padding: "2px 10px",
              fontSize: 12,
              color: "#3f3f46",
            }}
          >
            {plugin.manifest.nav.label}
          </span>
        ))}
      </div>
      {plugins.map((plugin) => (
        <div key={plugin.manifest.id} style={{ marginTop: 12 }}>
          <plugin.View host={host} />
        </div>
      ))}
    </div>
  );
}

export default ModuAiRemote;
