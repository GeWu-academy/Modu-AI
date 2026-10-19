import { NextResponse } from "next/server";
import type { ChatApiResponse } from "@/ai-module";

// Placeholder backend. To be replaced by the Modu Go API (apps/api/internal/modules/ai).
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求体必须是合法 JSON" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "请求体必须是 JSON 对象" }, { status: 400 });
  }
  const message = (body as Record<string, unknown>).message;
  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "message 必填" }, { status: 400 });
  }

  const payload: ChatApiResponse = {
    reply:
      "（占位回复）AI 后端接口目前由 Next.js Route Handler 临时承接；接入 Modu AI 后端与真实 Provider 后，这里将返回模型输出并支持流式渲染。",
  };
  return NextResponse.json(payload);
}
