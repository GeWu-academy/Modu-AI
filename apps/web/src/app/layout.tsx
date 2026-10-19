import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { QueryProvider } from "@/components/QueryProvider";

export const metadata: Metadata = {
  title: { default: "Modu-AI 控制台", template: "%s · Modu-AI" },
  description: "Modu AI 企业级模块底座：统一 Provider 管理与业务插件工作台。",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <QueryProvider>
          <AppShell>{children}</AppShell>
        </QueryProvider>
      </body>
    </html>
  );
}
