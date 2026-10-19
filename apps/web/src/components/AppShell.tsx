"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navSections } from "@/lib/nav";
import { Toaster } from "./Toaster";

function getNavIcon(path: string) {
  if (path === "/" || path === "") {
    return (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }
  if (path.includes("provider")) {
    return (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="3" />
        <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="3" />
      </svg>
    );
  }
  if (path.includes("chat")) {
    return (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    );
  }
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}

function getBreadcrumb(pathname: string) {
  if (pathname === "/") {
    return { section: "工作台", page: "控制台概览" };
  }
  if (pathname.startsWith("/ai/providers")) {
    return { section: "底座基础设施", page: "Provider 管理" };
  }
  if (pathname.startsWith("/ai/chat")) {
    return { section: "AI 业务插件", page: "智能对话助手 (ai.chat)" };
  }
  return { section: "控制台", page: pathname };
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const breadcrumb = getBreadcrumb(pathname);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/" className="brand">
            <div className="brand-icon">M</div>
            <div className="brand-text">
              <span className="brand-title">Modu AI</span>
              <span className="brand-tag">企业级 AI 模块底座</span>
            </div>
          </Link>
        </div>

        <div className="sidebar-body">
          <div className="sidebar-group">
            <div className="sidebar-group-title">控制台</div>
            <Link
              href="/"
              className={pathname === "/" ? "nav nav-active" : "nav"}
            >
              {getNavIcon("/")}
              <span>控制台首页</span>
            </Link>
          </div>

          {navSections.map((section) => (
            <div key={section.title} className="sidebar-group">
              <div className="sidebar-group-title">{section.title}</div>
              {section.items.map((item) => {
                const active = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={active ? "nav nav-active" : "nav"}
                  >
                    {getNavIcon(item.path)}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="system-status">
            <span className="status-indicator">
              <span className="status-dot" />
              <span>系统网关在线</span>
            </span>
            <span className="badge">v0.1.0</span>
          </div>
          <div className="muted" style={{ fontSize: "11px" }}>
            隔离契约 · HostAdapter
          </div>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div className="topbar-left">
            <span className="breadcrumb-root">{breadcrumb.section}</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{breadcrumb.page}</span>
          </div>
          <div className="topbar-right">
            <span className="env-pill">
              <span className="status-dot" style={{ width: "6px", height: "6px" }} />
              <span>生产环境 · Standalone</span>
            </span>
          </div>
        </header>

        <div className="main-container">
          {children}
        </div>
      </main>

      <Toaster />
    </div>
  );
}
