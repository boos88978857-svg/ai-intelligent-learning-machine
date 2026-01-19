import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 智能學習機",
  description: "學習入口系統",
};

const navWrap: React.CSSProperties = {
  position: "sticky",
  top: 0,
  background: "white",
  borderBottom: "1px solid rgba(0,0,0,0.08)",
  padding: 12,
  zIndex: 10,
};

const navRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const navBtn: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 12px",
  border: "1px solid rgba(0,0,0,0.2)",
  borderRadius: 10,
  textDecoration: "none",
  color: "#1d4ed8",
  background: "white",
};

const container: React.CSSProperties = {
  maxWidth: 980,
  margin: "0 auto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>
        <header style={navWrap}>
          <div style={container}>
            <nav style={navRow}>
              <Link href="/" style={navBtn}>
                首頁
              </Link>
              <Link href="/learn" style={navBtn}>
                學習區
              </Link>
              <Link href="/records" style={navBtn}>
                記錄
              </Link>
              <Link href="/settings" style={navBtn}>
                設定
              </Link>
              <Link href="/about" style={navBtn}>
                關於
              </Link>
            </nav>
          </div>
        </header>

        <main style={container}>{children}</main>
      </body>
    </html>
  );
}