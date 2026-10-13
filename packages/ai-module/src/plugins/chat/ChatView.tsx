import { useState } from "react";
import type { PluginViewProps } from "../../platform";

interface DraftMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatView({ host }: PluginViewProps) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<DraftMessage[]>([]);

  function send() {
    const content = draft.trim();
    if (!content) {
      return;
    }
    setMessages((previous) => [
      ...previous,
      { id: crypto.randomUUID(), role: "user", content },
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "（占位回复）底座尚未接入真实模型，后续任务实现 Provider 调用与流式渲染。",
      },
    ]);
    setDraft("");
    host.notifications.notify({ level: "info", message: "已记录一条占位消息" });
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
              send();
            }
          }}
        />
        <button type="button" onClick={send}>
          发送
        </button>
      </div>
    </section>
  );
}
