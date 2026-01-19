import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "AI 智能学习机",
  description: "学习系统",
};

const navWrap: React.CSSProperties = {
  display: "flex",
  gap: 12,
  padding: "12px 24px",
  borderBottom: "1px solid rgba(0,0,0,0.12)",
  position: "sticky",
  top: 0,
  background: "white",
};

const navLink: React.CSSProperties = {
  textDecoration: "none",
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,0.12)",
  display: "inline-block",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hans">
      <body>
        <nav style={navWrap}>
          <Link href="/" style={navLink}>首页</Link>
          <Link href="/practice" style={navLink}>练习区</Link>
          <Link href="/english" style={navLink}>英文</Link>
          <Link href="/math" style={navLink}>数学</Link>
        </nav>

        {children}
      </body>
    </html>
  );
}