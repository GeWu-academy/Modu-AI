import type { ProviderDescriptor } from "../contracts/index";

export interface ProviderRegistry {
  list(): ProviderDescriptor[];
  get(id: string): ProviderDescriptor | undefined;
  upsert(provider: ProviderDescriptor): void;
  remove(id: string): void;
}

export function createProviderRegistry(seed: ProviderDescriptor[] = []): ProviderRegistry {
  const providers = new Map<string, ProviderDescriptor>(seed.map((provider) => [provider.id, provider]));
  return {
    list: () => [...providers.values()],
    get: (id) => providers.get(id),
    upsert: (provider) => {
      providers.set(provider.id, provider);
    },
    remove: (id) => {
      providers.delete(id);
    },
  };
}
