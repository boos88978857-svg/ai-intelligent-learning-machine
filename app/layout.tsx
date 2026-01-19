// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { ui } from "./ui";

export const metadata = {
  title: "AI 智能學習機",
  description: "學習入口與練習系統",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <div style={ui.page}>
          {/* 上方導覽（全站一致） */}
          <nav style={ui.navWrap}>
            <div style={ui.nav}>
              <Link href="/" style={ui.navBtn}>首頁</Link>
              <Link href="/practice" style={ui.navBtn}>學習區</Link>
              <Link href="/records" style={ui.navBtn}>記錄</Link>
              <Link href="/settings" style={ui.navBtn}>設定</Link>
              <Link href="/about" style={ui.navBtn}>關於</Link>
            </div>
          </nav>

          {/* 每頁內容 */}
          <main style={ui.main}>{children}</main>
        </div>
      </body>
    </html>
  );
}