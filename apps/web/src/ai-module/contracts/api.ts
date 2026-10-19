import type { ProviderDescriptor, ProviderKind } from "./provider";

/** Minimal provider creation payload accepted by the temporary Route Handler backend. */
export interface ProviderCreateRequest {
  name: string;
  kind: ProviderKind;
  baseUrl?: string;
  /** Plaintext is accepted on create only; the backend stores a masked reference. */
  apiKey?: string;
  model?: {
    id: string;
    label?: string;
  };
}

export interface ProviderListResponse {
  providers: ProviderDescriptor[];
}

export interface ProviderCreateResponse {
  provider: ProviderDescriptor;
}

export interface ChatApiRequest {
  message: string;
}

export interface ChatApiResponse {
  reply: string;
}
