"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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
  const [formOpen, setFormOpen] = useState(true);

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
        message: `Provider「${provider.name}」已注册成功（占位存储）`,
      });
      setName("");
      setBaseUrl("");
      setModelId("");
      setApiKey("");
    },
    onError: (error) => {
      host.notifications.notify({
        level: "error",
        message: error instanceof Error ? error.message : "注册 Provider 失败",
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
    <>
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title-area">
            <h1>Provider 基础设施管理</h1>
            <p className="panel-description">
              注册并维护大模型底座提供商。业务插件通过底座协议调用各模型服务，密钥仅以掩码形式回显，由后端加密存储。
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setFormOpen((prev) => !prev)}
          >
            {formOpen ? "收起注册面板" : "+ 注册新提供商"}
          </button>
        </div>

        {/* 状态统计条 */}
        <div style={{ display: "flex", gap: "24px", padding: "12px 16px", background: "var(--panel-secondary)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", marginBottom: "18px", fontSize: "13px" }}>
          <div>
            <span className="muted">已接入提供商：</span>
            <strong style={{ color: "var(--text)", marginLeft: "4px" }}>{providers.length} 个</strong>
          </div>
          <div>
            <span className="muted">协议规范：</span>
            <span className="badge" style={{ marginLeft: "4px" }}>OpenAI Compatible</span>
            <span className="badge" style={{ marginLeft: "4px" }}>Anthropic</span>
            <span className="badge" style={{ marginLeft: "4px" }}>Azure</span>
          </div>
          <div>
            <span className="muted">存储策略：</span>
            <span className="badge badge-ok" style={{ marginLeft: "4px" }}>加密脱敏保护</span>
          </div>
        </div>

        {/* 注册表单（手风琴平滑折叠展开） */}
        <AnimatePresence initial={false}>
          {formOpen && (
            <motion.div
              key="provider-form"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              <form className="form-section" onSubmit={submit}>
                <div className="form-section-title">注册模型提供商 (Provider)</div>
                <div className="form-section-desc">
                  填写大模型服务的服务商类别、网络端点与默认模型标识。
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="provider-name">
                      <span>提供商名称</span>
                      <span className="hint">必填</span>
                    </label>
                    <input
                      id="provider-name"
                      value={name}
                      placeholder="例如：OpenAI 生产集群"
                      onChange={(event) => setName(event.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="provider-kind">
                      <span>协议类别</span>
                      <span className="hint">标准协议</span>
                    </label>
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
                    <label htmlFor="provider-base-url">
                      <span>API Base URL</span>
                      <span className="hint">可选，默认官方端点</span>
                    </label>
                    <input
                      id="provider-base-url"
                      value={baseUrl}
                      placeholder="https://api.openai.com/v1"
                      onChange={(event) => setBaseUrl(event.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="provider-model">
                      <span>默认模型 ID</span>
                      <span className="hint">可选，例如 gpt-4o-mini</span>
                    </label>
                    <input
                      id="provider-model"
                      value={modelId}
                      placeholder="例如：gpt-4o-mini"
                      onChange={(event) => setModelId(event.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="provider-key">
                      <span>API Key</span>
                      <span className="hint">提交后脱敏加密</span>
                    </label>
                    <input
                      id="provider-key"
                      type="password"
                      value={apiKey}
                      placeholder="sk-••••••••"
                      onChange={(event) => setApiKey(event.target.value)}
                    />
                  </div>
                </div>

                <div className="actions">
                  <button type="submit" disabled={createMutation.isPending || !name.trim()}>
                    {createMutation.isPending ? "注册中…" : "确认注册 Provider"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setName("");
                      setBaseUrl("");
                      setModelId("");
                      setApiKey("");
                    }}
                  >
                    重置表单
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 提供商资源列表 */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "600" }}>已注册 Provider 资源清单</h2>
            <span className="muted" style={{ fontSize: "12px" }}>共 {providers.length} 项</span>
          </div>

          <div className="provider-list">
            {providersQuery.isPending ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--muted)" }}>
                正在查询 Provider 资源列表…
              </div>
            ) : providersQuery.isError ? (
              <div className="error-text" style={{ padding: "16px", background: "var(--danger-soft)", borderRadius: "var(--radius-md)", border: "1px solid var(--danger-border)" }}>
                加载失败：{providersQuery.error instanceof Error ? providersQuery.error.message : "未知错误"}
              </div>
            ) : providers.length === 0 ? (
              <div className="empty-chat" style={{ border: "1px dashed var(--border-strong)", borderRadius: "var(--radius-md)" }}>
                <div className="empty-chat-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="8" rx="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="3" />
                    <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="3" />
                  </svg>
                </div>
                <div className="empty-chat-title">尚未配置任何模型提供商</div>
                <div className="empty-chat-desc">
                  当前环境尚未注册 Provider。请在上方表单中配置首个大模型服务（如 OpenAI 兼容代理或官方服务），插件将自动引用该配置进行调用。
                </div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {providers.map((provider) => (
                  <motion.div
                    key={provider.id}
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="provider-item"
                  >
                    <div className="provider-head">
                      <div className="provider-name-group">
                        <span className="status-dot" />
                        <span className="provider-name">{provider.name}</span>
                        <span className="badge">{provider.kind}</span>
                        {provider.enabled ? <span className="badge badge-ok">活跃可用</span> : null}
                      </div>
                      <span className="code-chip">ID: {provider.id}</span>
                    </div>

                    <div className="provider-details">
                      <div className="detail-item">
                        <span className="muted">服务端点：</span>
                        <span className="code-chip">{provider.baseUrl ?? "默认官方端点"}</span>
                      </div>

                      <div className="detail-item">
                        <span className="muted">关联模型：</span>
                        {provider.models.length > 0 ? (
                          provider.models.map((model) => (
                            <span key={model.id} className="badge badge-blue">
                              {model.id}
                            </span>
                          ))
                        ) : (
                          <span className="muted">未绑定默认模型</span>
                        )}
                      </div>

                      <div className="detail-item">
                        <span className="muted">凭证状态：</span>
                        <span className="badge">已脱敏保护</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
