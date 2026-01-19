import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "AI 智能学习机",
  description: "练习型学习系统",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        {/* 顶部导航 */}
        <nav style={{ padding: 16, borderBottom: "1px solid #ddd" }}>
          <Link href="/" style={{ marginRight: 16 }}>
            首页
          </Link>
          <Link href="/practice">
            练习区
          </Link>
        </nav>

        {/* 页面内容 */}
        <main style={{ padding: 24 }}>
          {children}
        </main>
      </body>
    </html>
  );
}