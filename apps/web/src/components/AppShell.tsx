"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { navSections } from "@/lib/nav";
import { Toaster } from "./Toaster";

export type ThemeMode = "white" | "beige";

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
  const [theme, setTheme] = useState<ThemeMode>("white");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTheme = params.get("theme") as ThemeMode | null;
      const saved = (urlTheme === "white" || urlTheme === "beige")
        ? urlTheme
        : (localStorage.getItem("modu_theme") as ThemeMode | null);

      if (saved === "white" || saved === "beige") {
        setTheme(saved);
        document.documentElement.setAttribute("data-theme", saved);
        localStorage.setItem("modu_theme", saved);
      } else {
        document.documentElement.setAttribute("data-theme", "white");
      }
    } catch {
      document.documentElement.setAttribute("data-theme", "white");
    }
  }, []);

  function handleThemeChange(nextTheme: ThemeMode) {
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("modu_theme", nextTheme);
    } catch {
      // ignore storage errors
    }
  }

  const isHomeActive = pathname === "/";

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
              className={`nav ${isHomeActive ? "nav-active" : ""}`}
            >
              {isHomeActive && (
                <motion.span
                  layoutId="sidebar-active-indicator"
                  className="nav-active-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {getNavIcon("/")}
              <span className="nav-label">控制台首页</span>
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
                    className={`nav ${active ? "nav-active" : ""}`}
                  >
                    {active && (
                      <motion.span
                        layoutId="sidebar-active-indicator"
                        className="nav-active-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {getNavIcon(item.path)}
                    <span className="nav-label">{item.label}</span>
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
            <div className="theme-switcher" role="radiogroup" aria-label="主题风格切换">
              <button
                type="button"
                role="radio"
                aria-checked={mounted && theme === "white"}
                className={`theme-btn ${mounted && theme === "white" ? "theme-btn-active" : ""}`}
                onClick={() => handleThemeChange("white")}
                title="切换到白色透明风格"
              >
                {mounted && theme === "white" && (
                  <motion.span
                    layoutId="theme-active-indicator"
                    className="theme-active-indicator"
                    transition={{ type: "spring", stiffness: 460, damping: 34 }}
                  />
                )}
                <svg
                  className="theme-btn-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
                </svg>
                <span className="theme-btn-label">白色透明</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={mounted && theme === "beige"}
                className={`theme-btn ${mounted && theme === "beige" ? "theme-btn-active" : ""}`}
                onClick={() => handleThemeChange("beige")}
                title="切换到温润米黄风格"
              >
                {mounted && theme === "beige" && (
                  <motion.span
                    layoutId="theme-active-indicator"
                    className="theme-active-indicator"
                    transition={{ type: "spring", stiffness: 460, damping: 34 }}
                  />
                )}
                <svg
                  className="theme-btn-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
                <span className="theme-btn-label">温润米黄</span>
              </button>
            </div>
          </div>
        </header>

        <div className="main-container">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="page-transition-wrapper"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Toaster />
    </div>
  );
}
