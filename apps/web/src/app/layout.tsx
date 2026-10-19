import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { QueryProvider } from "@/components/QueryProvider";

export const metadata: Metadata = {
  title: { default: "Modu-AI", template: "%s · Modu-AI" },
  description: "Modu AI 模块的独立 Next.js 应用：Provider 底座 + 可插拔业务插件。",
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
