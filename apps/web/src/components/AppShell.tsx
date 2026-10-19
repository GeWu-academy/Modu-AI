"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navSections } from "@/lib/nav";
import { Toaster } from "./Toaster";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link href="/" className="brand">
          Modu-AI
        </Link>
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="sidebar-group">{section.title}</div>
            {section.items.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={pathname === item.path ? "nav nav-active" : "nav"}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </aside>
      <main className="content">
        <header className="topbar">
          <span>Modu-AI 控制台</span>
          <span className="muted">Next.js · 独立部署</span>
        </header>
        {children}
      </main>
      <Toaster />
    </div>
  );
}
