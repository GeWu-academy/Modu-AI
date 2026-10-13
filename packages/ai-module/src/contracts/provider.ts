export type ProviderKind = "openai-compatible" | "anthropic" | "azure-openai";

export type ModelCapability = "chat" | "embedding";

export interface ProviderModel {
  id: string;
  label: string;
  capabilities: ModelCapability[];
}

export interface ProviderDescriptor {
  id: string;
  name: string;
  kind: ProviderKind;
  baseUrl?: string;
  models: ProviderModel[];
  enabled: boolean;
}

/** References a stored secret without ever carrying its plaintext value. */
export interface ProviderSecretRef {
  providerId: string;
  masked: string;
  updatedAt: string;
}
