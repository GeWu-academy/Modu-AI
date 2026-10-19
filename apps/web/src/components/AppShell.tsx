"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navSections } from "@/lib/nav";
import { Toaster } from "./Toaster";

export type ThemeMode = "white" | "beige";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<ThemeMode>("white");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("modu_theme") as ThemeMode | null;
    if (saved === "white" || saved === "beige") {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
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

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-badge">M</span>
          <span>Modu-AI</span>
        </Link>
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="sidebar-group">{section.title}</div>
            {section.items.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={active ? "nav nav-active" : "nav"}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </aside>
      <main className="content">
        <header className="topbar">
          <div className="topbar-left">
            <span>Modu-AI 控制台</span>
            <span className="topbar-tag">独立部署</span>
          </div>
          <div className="topbar-right">
            <div className="theme-switcher" role="radiogroup" aria-label="主题风格切换">
              <button
                type="button"
                className={`theme-btn ${mounted && theme === "white" ? "theme-btn-active" : ""}`}
                onClick={() => handleThemeChange("white")}
                title="切换到白色透明风格"
              >
                <span className="dot dot-white" />
                <span>白色透明</span>
              </button>
              <button
                type="button"
                className={`theme-btn ${mounted && theme === "beige" ? "theme-btn-active" : ""}`}
                onClick={() => handleThemeChange("beige")}
                title="切换到温润米黄风格"
              >
                <span className="dot dot-beige" />
                <span>温润米黄</span>
              </button>
            </div>
          </div>
        </header>
        {children}
      </main>
      <Toaster />
    </div>
  );
}
