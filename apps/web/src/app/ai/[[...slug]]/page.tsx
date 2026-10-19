import { notFound, redirect } from "next/navigation";
import { PluginHostView } from "@/components/PluginHostView";
import { ProvidersView } from "@/components/ProvidersView";
import { resolveAiRoute } from "@/lib/nav";

export default async function AiRoutePage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  if (!slug || slug.length === 0) {
    redirect("/ai/chat");
  }
  const route = resolveAiRoute(`/ai/${slug.join("/")}`);
  if (!route) {
    notFound();
  }
  return route.kind === "providers" ? (
    <ProvidersView />
  ) : (
    <PluginHostView pluginId={route.pluginId} />
  );
}
