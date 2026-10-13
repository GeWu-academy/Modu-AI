import type { PermissionId } from "./permissions.js";

export interface HostTheme {
  mode: "light" | "dark";
  tokens: Record<string, string>;
}

export interface HostIdentity {
  userId: string;
  tenantId: string;
  displayName: string;
}

export interface HostApiRequest {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  body?: unknown;
  signal?: AbortSignal;
}

export interface HostApiClient {
  baseUrl: string;
  request<TResponse>(input: HostApiRequest): Promise<TResponse>;
}

export interface HostNotifications {
  notify(input: { level: "info" | "success" | "warning" | "error"; message: string }): void;
  confirm(input: { title: string; message: string }): Promise<boolean>;
}

/**
 * The only surface a host must implement. Core code depends on this contract
 * and never imports host internals, which keeps Modu-AI pluggable and removable.
 */
export interface HostAdapter {
  name: string;
  getTheme(): HostTheme;
  getIdentity(): HostIdentity;
  can(permissionId: PermissionId): boolean;
  apiClient: HostApiClient;
  notifications: HostNotifications;
}
