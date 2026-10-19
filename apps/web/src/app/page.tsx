import Link from "next/link";
import { builtinPlugins } from "@/ai-module";

export default function HomePage() {
  return (
    <section className="panel">
      <h1>Modu-AI</h1>
      <p className="muted">
        AI 底座（Provider 注册、插件注册表）与业务插件的独立 Next.js 应用。占位后端由同仓库 Route Handlers
        承接，可整体切换到 Modu Go API（设置 NEXT_PUBLIC_MODU_API_BASE_URL）。
      </p>
      <div className="cards">
        <Link className="card" href="/ai/providers">
          <div className="card-title">Provider 管理</div>
          <div className="muted">配置模型提供商与密钥引用（占位存储，重启即清空）。</div>
        </Link>
        {builtinPlugins.map((plugin) => (
          <Link key={plugin.manifest.id} className="card" href={plugin.manifest.nav.path}>
            <div className="card-title">{plugin.manifest.nav.label}</div>
            <div className="muted">{plugin.manifest.description}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
