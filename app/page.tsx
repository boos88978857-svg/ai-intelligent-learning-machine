import Link from "next/link";

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 12,
};

const cardStyle: React.CSSProperties = {
  display: "block",
  padding: 16,
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: 12,
  textDecoration: "none",
};

const smallText: React.CSSProperties = {
  margin: "8px 0 0",
  opacity: 0.7,
  lineHeight: 1.6,
};

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>AI 智能学习机</h1>
        <p style={{ margin: "8px 0 0", opacity: 0.7 }}>
          请选择入口开始学习
        </p>
      </header>

      {/* 网格入口（手机 1 列；平板/横屏我们下一步用 CSS 变 3 列） */}
      <div style={gridStyle}>
        <Link href="/english" style={cardStyle}>
          <h2 style={{ margin: 0 }}>英文专区</h2>
          <p style={smallText}>A1–C2、TOEIC、学习＋练习</p>
        </Link>

        <Link href="/math" style={cardStyle}>
          <h2 style={{ margin: 0 }}>数学专区</h2>
          <p style={smallText}>国小/国中/高中分级练习</p>
        </Link>

        <Link href="/practice" style={cardStyle}>
          <h2 style={{ margin: 0 }}>练习区（测试）</h2>
          <p style={smallText}>你已完成的练习模块入口</p>
        </Link>

        <Link href="/settings" style={cardStyle}>
          <h2 style={{ margin: 0 }}>设定</h2>
          <p style={smallText}>显示、横屏、声音、偏好</p>
        </Link>

        <Link href="/about" style={cardStyle}>
          <h2 style={{ margin: 0 }}>关于</h2>
          <p style={smallText}>版本、说明、联系</p>
        </Link>
      </div>

      <p style={{ marginTop: 16, opacity: 0.6 }}>
        下一步：我们会把这里改成「横屏 3×2 网格」并统一样式。
      </p>
    </main>
  );
}