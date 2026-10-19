import Link from "next/link";
import { builtinPlugins } from "@/ai-module";

export default function HomePage() {
  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title-area">
            <h1>Modu AI 企业级控制台</h1>
            <p className="panel-description">
              多模型统一抽象底座与业务插件系统。支持 OpenAI 兼容、Anthropic、Azure OpenAI 等多模型提供商的集中编排与业务插件调度。
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span className="badge badge-ok">运行状态正常</span>
            <span className="badge badge-blue">微内核规范</span>
          </div>
        </div>

        {/* 关键运行指标 */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">
              <span>提供商接入</span>
              <span className="badge">多协议</span>
            </div>
            <div className="kpi-value">Multi-Provider</div>
            <div className="kpi-meta">
              <span className="status-dot" />
              <span>支持 OpenAI / Anthropic / Azure</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">
              <span>已装载插件</span>
              <span className="badge badge-blue">{builtinPlugins.length} 个活跃</span>
            </div>
            <div className="kpi-value">{builtinPlugins.length} Active</div>
            <div className="kpi-meta">
              <span>默认集成：智能对话助手</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">
              <span>契约版本</span>
              <span className="badge">Single Source</span>
            </div>
            <div className="kpi-value">v1.0.0</div>
            <div className="kpi-meta">
              <span>基于 contracts/ 唯一源头</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">
              <span>网关适配</span>
              <span className="badge">HostAdapter</span>
            </div>
            <div className="kpi-value">Standalone</div>
            <div className="kpi-meta">
              <span>可一键切换 Modu Go API</span>
            </div>
          </div>
        </div>
      </div>

      {/* 核心服务网格 */}
      <div>
        <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text)" }}>核心模块与插件入口</h2>
          <span className="muted" style={{ fontSize: "12px" }}>点击卡片进入对应工作区</span>
        </div>

        <div className="cards">
          <Link className="card" href="/ai/providers">
            <div className="card-top">
              <div className="card-title">
                <span>Provider 基础设施</span>
                <span className="badge">底座管理</span>
              </div>
              <p className="muted">
                集中配置与注册大语言模型提供商端点、默认模型 ID 与访问凭据引用，支持脱敏回显与连通管理。
              </p>
            </div>
            <div className="card-footer">
              <span>配置模型提供商</span>
              <span>→</span>
            </div>
          </Link>

          {builtinPlugins.map((plugin) => (
            <Link key={plugin.manifest.id} className="card" href={plugin.manifest.nav.path}>
              <div className="card-top">
                <div className="card-title">
                  <span>{plugin.manifest.nav.label}</span>
                  <span className="badge badge-blue">业务插件</span>
                </div>
                <p className="muted">{plugin.manifest.description}</p>
              </div>
              <div className="card-footer">
                <span>启动 {plugin.manifest.nav.label}</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 架构与安全性合规规范 */}
      <div className="panel">
        <div style={{ marginBottom: "14px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "600" }}>企业级架构与安全合规规范</h2>
          <p className="muted" style={{ fontSize: "12px", marginTop: "3px" }}>
            遵循企业级高安全与高可用规范设计，确保业务与 AI 底座的解耦与稳定性。
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          <div style={{ background: "var(--panel-secondary)", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
            <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "6px", color: "var(--text)" }}>
              1. 宿主契约严格隔离
            </div>
            <p className="muted" style={{ fontSize: "12px", lineHeight: "1.5" }}>
              模块核心（contracts / platform / plugins）不直接 import 宿主内部模块，仅依赖 HostAdapter 契约进行通讯。
            </p>
          </div>

          <div style={{ background: "var(--panel-secondary)", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
            <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "6px", color: "var(--text)" }}>
              2. 凭据端到端脱敏
            </div>
            <p className="muted" style={{ fontSize: "12px", lineHeight: "1.5" }}>
              API Key 等敏感认证信息在前端仅做掩码展示，绝不回显明文与落盘日志，真实值由后端统一加密保管。
            </p>
          </div>

          <div style={{ background: "var(--panel-secondary)", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
            <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "6px", color: "var(--text)" }}>
              3. 编译期静态注册
            </div>
            <p className="muted" style={{ fontSize: "12px", lineHeight: "1.5" }}>
              坚决杜绝运行时外部代码热注入与任意命令执行；插件随应用静态编译，白名单严格管控接口调用。
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
