import { NextResponse } from "next/server";
import type { ProviderCreateRequest, ProviderKind, ProviderListResponse } from "@/ai-module";
import { createProvider, listProviders } from "@/server/providerStore";

// Placeholder backend. To be replaced by the Modu Go API (apps/api/internal/modules/ai).
export const dynamic = "force-dynamic";

const PROVIDER_KINDS: ProviderKind[] = ["openai-compatible", "anthropic", "azure-openai"];

function parseCreateRequest(body: unknown): ProviderCreateRequest | string {
  if (typeof body !== "object" || body === null) {
    return "请求体必须是 JSON 对象";
  }
  const record = body as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name.trim() : "";
  if (!name) {
    return "name 必填";
  }
  const kind = record.kind;
  if (typeof kind !== "string" || !PROVIDER_KINDS.includes(kind as ProviderKind)) {
    return `kind 必须是 ${PROVIDER_KINDS.join(" / ")} 之一`;
  }
  if (record.baseUrl !== undefined && typeof record.baseUrl !== "string") {
    return "baseUrl 必须是字符串";
  }
  if (record.apiKey !== undefined && typeof record.apiKey !== "string") {
    return "apiKey 必须是字符串";
  }
  let model: ProviderCreateRequest["model"];
  if (record.model !== undefined) {
    if (typeof record.model !== "object" || record.model === null) {
      return "model 必须是对象";
    }
    const modelRecord = record.model as Record<string, unknown>;
    if (modelRecord.id !== undefined && typeof modelRecord.id !== "string") {
      return "model.id 必须是字符串";
    }
    if (modelRecord.label !== undefined && typeof modelRecord.label !== "string") {
      return "model.label 必须是字符串";
    }
    model = {
      id: (modelRecord.id as string | undefined) ?? "",
      label: modelRecord.label as string | undefined,
    };
  }
  return {
    name,
    kind: kind as ProviderKind,
    baseUrl: record.baseUrl as string | undefined,
    apiKey: record.apiKey as string | undefined,
    model,
  };
}

export async function GET() {
  const payload: ProviderListResponse = { providers: listProviders() };
  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求体必须是合法 JSON" }, { status: 400 });
  }
  const parsed = parseCreateRequest(body);
  if (typeof parsed === "string") {
    return NextResponse.json({ error: parsed }, { status: 400 });
  }
  const provider = createProvider(parsed);
  return NextResponse.json({ provider }, { status: 201 });
}
