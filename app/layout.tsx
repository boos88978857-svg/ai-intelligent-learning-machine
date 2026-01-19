import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        {/* 顶部导航 */}
        <header
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #eee",
            marginBottom: 24,
          }}
        >
          <nav style={{ display: "flex", gap: 16 }}>
            <Link href="/">首页</Link>
            <Link href="/practice">练习区</Link>
          </nav>
        </header>

        {/* 页面内容 */}
        <main style={{ padding: 24 }}>{children}</main>
      </body>
    </html>
  );
}