"use client";

import { useState } from "react";
import type { ChatApiResponse } from "../../contracts/api";
import type { PluginViewProps } from "../../platform";

interface DraftMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatView({ host }: PluginViewProps) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<DraftMessage[]>([]);
  const [pending, setPending] = useState(false);

  async function send() {
    const content = draft.trim();
    if (!content || pending) {
      return;
    }
    setMessages((previous) => [
      ...previous,
      { id: crypto.randomUUID(), role: "user", content },
    ]);
    setDraft("");
    setPending(true);
    try {
      const response = await host.apiClient.request<ChatApiResponse>({
        method: "POST",
        path: "/chat",
        body: { message: content },
      });
      setMessages((previous) => [
        ...previous,
        { id: crypto.randomUUID(), role: "assistant", content: response.reply },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "请求失败";
      host.notifications.notify({ level: "error", message });
      setMessages((previous) => [
        ...previous,
        { id: crypto.randomUUID(), role: "assistant", content: `请求失败：${message}` },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="panel">
      <h2>对话助手</h2>
      <p className="muted">插件 id：ai.chat · 宿主：{host.name}</p>
      <div className="messages">
        {messages.length === 0 ? (
          <p className="muted">还没有消息，输入后点击发送。</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`bubble bubble-${message.role}`}>
              {message.content}
            </div>
          ))
        )}
      </div>
      <div className="composer">
        <input
          value={draft}
          placeholder="输入消息，回车发送"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              void send();
            }
          }}
        />
        <button type="button" onClick={() => void send()} disabled={pending}>
          {pending ? "生成中…" : "发送"}
        </button>
      </div>
    </section>
  );
}
