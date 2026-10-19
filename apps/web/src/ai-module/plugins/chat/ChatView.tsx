"use client";

import { useState } from "react";
import type { ChatApiResponse } from "../../contracts/api";
import type { PluginViewProps } from "../../platform";

interface DraftMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const ENTERPRISE_PROMPTS = [
  "测试并验证当前默认 Provider 的连通性",
  "简述 Modu AI 中 HostAdapter 的隔离与契约机制",
  "输出一份标准 OpenAI 兼容接口调用 Payload 示例",
  "列出当前插件注册表内已启用的插件清单",
];

export function ChatView({ host }: PluginViewProps) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<DraftMessage[]>([]);
  const [pending, setPending] = useState(false);

  async function handleSend(textToSend?: string) {
    const content = (textToSend ?? draft).trim();
    if (!content || pending) {
      return;
    }
    const now = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setMessages((previous) => [
      ...previous,
      { id: crypto.randomUUID(), role: "user", content, timestamp: now },
    ]);
    if (!textToSend) {
      setDraft("");
    }
    setPending(true);
    try {
      const response = await host.apiClient.request<ChatApiResponse>({
        method: "POST",
        path: "/chat",
        body: { message: content },
      });
      const replyTime = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setMessages((previous) => [
        ...previous,
        { id: crypto.randomUUID(), role: "assistant", content: response.reply, timestamp: replyTime },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "请求失败";
      host.notifications.notify({ level: "error", message });
      const errTime = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setMessages((previous) => [
        ...previous,
        { id: crypto.randomUUID(), role: "assistant", content: `请求失败：${message}`, timestamp: errTime },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <div className="panel" style={{ padding: "16px 20px" }}>
        <div className="panel-header" style={{ marginBottom: "0", paddingBottom: "0", borderBottom: "none" }}>
          <div className="panel-title-area">
            <h1>智能对话助手工作台 (ai.chat)</h1>
            <p className="panel-description">
              企业级 AI 会话交互环境。经由底座 Provider 网关分发调度，提供多轮会话测试与模型响应验证。
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span className="badge badge-ok">服务就绪</span>
            <span className="code-chip">插件 ID: ai.chat</span>
          </div>
        </div>
      </div>

      <div className="workbench-shell">
        <div className="workbench-bar">
          <div className="workbench-meta">
            <span className="status-dot" />
            <span style={{ fontWeight: 600 }}>会话通道就绪</span>
            <span className="muted">·</span>
            <span className="muted">宿主适配器：</span>
            <span className="badge">{host.name}</span>
            <span className="muted">·</span>
            <span className="muted">消息数量：</span>
            <span className="badge">{messages.length} 条</span>
          </div>

          <div className="workbench-actions">
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: "4px 10px", fontSize: "12px" }}
              disabled={messages.length === 0}
              onClick={() => setMessages([])}
            >
              清空对话
            </button>
          </div>
        </div>

        <div className="messages">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-chat-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="empty-chat-title">开启模型对话会话</div>
              <div className="empty-chat-desc">
                在下方输入框键入测试提示词，或点击以下预设指令快速验证底座 Provider 调度链路：
              </div>
              <div className="prompt-suggestions">
                {ENTERPRISE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="prompt-chip"
                    onClick={() => void handleSend(prompt)}
                  >
                    {prompt} →
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={message.id}
                  className={`message-row ${isUser ? "message-user" : "message-assistant"}`}
                >
                  <div className={`message-avatar ${isUser ? "avatar-user" : "avatar-ai"}`}>
                    {isUser ? "YOU" : "AI"}
                  </div>
                  <div className="message-content">
                    <div className="message-meta">
                      <span>{isUser ? "用户请求" : "模型响应"}</span>
                      <span>·</span>
                      <span>{message.timestamp}</span>
                    </div>
                    <div className={`bubble bubble-${message.role}`}>
                      {message.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="composer-container">
          <div className="composer">
            <input
              value={draft}
              placeholder="输入企业提示词或测试指令，按 Enter 发送…"
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void handleSend();
                }
              }}
              disabled={pending}
            />
            <button
              type="button"
              className="btn-blue"
              onClick={() => void handleSend()}
              disabled={pending || !draft.trim()}
            >
              {pending ? "模型响应中…" : "发送指令"}
            </button>
          </div>
          <div className="composer-hint">
            <span>快捷键：Enter 发送 · 经由 Provider 统一鉴权与端点分发</span>
            <span>契约规范：HostApiClient</span>
          </div>
        </div>
      </div>
    </>
  );
}
