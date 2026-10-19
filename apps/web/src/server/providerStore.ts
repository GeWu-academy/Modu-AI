import type { ProviderCreateRequest, ProviderDescriptor, ProviderSecretRef } from "@/ai-module";

interface ProviderStore {
  providers: Map<string, ProviderDescriptor>;
  secrets: Map<string, ProviderSecretRef>;
}

/**
 * Temporary in-memory store backing the placeholder Route Handlers. Resets on
 * redeploy and is per-instance on serverless; it exists so the web app works
 * end-to-end until the Modu Go API (apps/api) takes over.
 */
const globalForStore = globalThis as unknown as { __moduAiProviderStore?: ProviderStore };

function getStore(): ProviderStore {
  if (!globalForStore.__moduAiProviderStore) {
    globalForStore.__moduAiProviderStore = {
      providers: new Map(),
      secrets: new Map(),
    };
  }
  return globalForStore.__moduAiProviderStore;
}

export function listProviders(): ProviderDescriptor[] {
  return [...getStore().providers.values()];
}

export function maskSecret(apiKey: string): string {
  if (apiKey.length <= 8) {
    return "****";
  }
  return `${apiKey.slice(0, 4)}****${apiKey.slice(-4)}`;
}

export function createProvider(input: ProviderCreateRequest): ProviderDescriptor {
  const store = getStore();
  const now = new Date().toISOString();
  const id = `p_${crypto.randomUUID().slice(0, 8)}`;
  const modelId = input.model?.id?.trim() || "default";
  const provider: ProviderDescriptor = {
    id,
    name: input.name,
    kind: input.kind,
    baseUrl: input.baseUrl?.trim() || undefined,
    models: [
      {
        id: modelId,
        label: input.model?.label?.trim() || modelId,
        capabilities: ["chat"],
      },
    ],
    enabled: true,
  };
  store.providers.set(id, provider);
  if (input.apiKey?.trim()) {
    store.secrets.set(id, {
      providerId: id,
      masked: maskSecret(input.apiKey.trim()),
      updatedAt: now,
    });
  }
  return provider;
}
