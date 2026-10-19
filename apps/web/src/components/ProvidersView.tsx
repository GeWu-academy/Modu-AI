"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type {
  ProviderCreateRequest,
  ProviderCreateResponse,
  ProviderKind,
  ProviderListResponse,
} from "@/ai-module";
import { createWebHost } from "@/host/webHost";

const PROVIDER_KINDS: ProviderKind[] = ["openai-compatible", "anthropic", "azure-openai"];

export function ProvidersView() {
  const host = useMemo(() => createWebHost(), []);
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [kind, setKind] = useState<ProviderKind>("openai-compatible");
  const [baseUrl, setBaseUrl] = useState("");
  const [modelId, setModelId] = useState("");
  const [apiKey, setApiKey] = useState("");

  const providersQuery = useQuery({
    queryKey: ["providers"],
    queryFn: () =>
      host.apiClient.request<ProviderListResponse>({ method: "GET", path: "/providers" }),
  });

  const createMutation = useMutation({
    mutationFn: (input: ProviderCreateRequest) =>
      host.apiClient.request<ProviderCreateResponse>({
        method: "POST",
        path: "/providers",
        body: input,
      }),
    onSuccess: ({ provider }) => {
      void queryClient.invalidateQueries({ queryKey: ["providers"] });
      host.notifications.notify({
        level: "success",
        message: `Provider「${provider.name}」已创建（占位存储）`,
      });
      setName("");
      setBaseUrl("");
      setModelId("");
      setApiKey("");
    },
    onError: (error) => {
      host.notifications.notify({
        level: "error",
        message: error instanceof Error ? error.message : "创建 Provider 失败",
      });
    },
  });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || createMutation.isPending) {
      return;
    }
    createMutation.mutate({
      name: name.trim(),
      kind,
      baseUrl: baseUrl.trim() || undefined,
      apiKey: apiKey.trim() || undefined,
      model: modelId.trim() ? { id: modelId.trim() } : undefined,
    });
  }

  const providers = providersQuery.data?.providers ?? [];

  return (
    <section className="panel">
      <h2>Provider 管理</h2>
      <p className="muted">
        底座基础设施：注册模型提供商，供插件解析与调用。当前为占位实现（内存存储，重启即清空），后续切换到
        Modu AI 后端；密钥仅以掩码形式回显。
      </p>

      <form className="form-grid" onSubmit={submit}>
        <div className="field">
          <label htmlFor="provider-name">名称</label>
          <input
            id="provider-name"
            value={name}
            placeholder="例如：OpenAI 生产"
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="provider-kind">类型</label>
          <select
            id="provider-kind"
            value={kind}
            onChange={(event) => setKind(event.target.value as ProviderKind)}
          >
            {PROVIDER_KINDS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="provider-base-url">Base URL（可选）</label>
          <input
            id="provider-base-url"
            value={baseUrl}
            placeholder="https://api.example.com/v1"
            onChange={(event) => setBaseUrl(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="provider-model">默认模型 id（可选）</label>
          <input
            id="provider-model"
            value={modelId}
            placeholder="例如：gpt-4o-mini"
            onChange={(event) => setModelId(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="provider-key">API Key（可选）</label>
          <input
            id="provider-key"
            type="password"
            value={apiKey}
            placeholder="仅提交给后端，掩码存储"
            onChange={(event) => setApiKey(event.target.value)}
          />
        </div>
        <div className="actions">
          <button type="submit" disabled={createMutation.isPending || !name.trim()}>
            {createMutation.isPending ? "创建中…" : "创建 Provider"}
          </button>
        </div>
      </form>

      <div className="provider-list">
        {providersQuery.isPending ? (
          <p className="muted">加载中…</p>
        ) : providersQuery.isError ? (
          <p className="error-text">
            加载失败：
            {providersQuery.error instanceof Error ? providersQuery.error.message : "未知错误"}
          </p>
        ) : providers.length === 0 ? (
          <p className="muted">尚未配置任何 Provider。</p>
        ) : (
          providers.map((provider) => (
            <div key={provider.id} className="provider-item">
              <div className="provider-head">
                <span className="provider-name">{provider.name}</span>
                <span className="badge">{provider.kind}</span>
                {provider.enabled ? <span className="badge badge-ok">enabled</span> : null}
              </div>
              <div className="muted">
                {provider.baseUrl ?? "默认地址"} · 模型：
                {provider.models.map((model) => model.id).join(", ") || "未配置"}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
