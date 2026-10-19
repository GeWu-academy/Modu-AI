import type { HostAdapter, PermissionId } from "@/ai-module";

export type NotifyLevel = "info" | "success" | "warning" | "error";

export interface NotifyDetail {
  level: NotifyLevel;
  message: string;
}

/** Window event used to surface host notifications in the UI. */
export const NOTIFY_EVENT = "modu-ai:notify";

const DEFAULT_PERMISSIONS: PermissionId[] = [
  "ai.provider.read",
  "ai.provider.write",
  "ai.chat.use",
  "ai.qa.use",
  "ai.report.run",
];

/**
 * Browser HostAdapter for the standalone web app. Swapping the AI backend to
 * the Modu Go API later only requires changing NEXT_PUBLIC_MODU_API_BASE_URL.
 */
export function createWebHost(): HostAdapter {
  const baseUrl = process.env.NEXT_PUBLIC_MODU_API_BASE_URL ?? "/api/v1/ai";
  const granted = new Set<PermissionId>(DEFAULT_PERMISSIONS);

  return {
    name: "modu-ai-web",
    getTheme: () => ({ mode: "dark", tokens: {} }),
    getIdentity: () => ({
      userId: "local-user",
      tenantId: "local",
      displayName: "本地用户",
    }),
    can: (permissionId) => granted.has(permissionId),
    apiClient: {
      baseUrl,
      request: async <TResponse>({
        method,
        path,
        body,
        signal,
      }: {
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        path: string;
        body?: unknown;
        signal?: AbortSignal;
      }): Promise<TResponse> => {
        const response = await fetch(`${baseUrl}${path}`, {
          method,
          headers: body === undefined ? undefined : { "content-type": "application/json" },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal,
        });
        if (!response.ok) {
          const detail = await response.text().catch(() => "");
          throw new Error(
            `${method} ${path} 失败：HTTP ${response.status}${detail ? ` · ${detail}` : ""}`,
          );
        }
        return (await response.json()) as TResponse;
      },
    },
    notifications: {
      notify: ({ level, message }) => {
        window.dispatchEvent(
          new CustomEvent<NotifyDetail>(NOTIFY_EVENT, { detail: { level, message } }),
        );
      },
      confirm: async ({ title, message }) => window.confirm(`${title}\n\n${message}`),
    },
  };
}
