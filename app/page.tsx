import Link from "next/link";

const wrap: React.CSSProperties = {
  padding: 24,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 12,
};

const card: React.CSSProperties = {
  display: "block",
  padding: 16,
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: 12,
  textDecoration: "none",
};

const title: React.CSSProperties = { margin: 0 };
const desc: React.CSSProperties = { margin: "8px 0 0", opacity: 0.7, lineHeight: 1.6 };

export default function Page() {
  return (
    <main style={wrap}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>AI 智能学习机</h1>
        <p style={{ margin: "8px 0 0", opacity: 0.7 }}>请选择入口开始学习</p>
      </header>

      <div style={grid}>
        <Link href="/english" style={card}>
          <h2 style={title}>英文专区</h2>
          <p style={desc}>A1–C2、TOEIC、学习＋练习</p>
        </Link>

        <Link href="/math" style={card}>
          <h2 style={title}>数学专区</h2>
          <p style={desc}>国小/国中/高中分级</p>
        </Link>

        <Link href="/practice" style={card}>
          <h2 style={title}>练习区（测试）</h2>
          <p style={desc}>你已完成的模块入口</p>
        </Link>

        <Link href="/settings" style={card}>
          <h2 style={title}>设定</h2>
          <p style={desc}>横屏、声音、偏好</p>
        </Link>

        <Link href="/about" style={card}>
          <h2 style={title}>关于</h2>
          <p style={desc}>版本、说明</p>
        </Link>

        <a href="https://ai-intelligent-learning-machine-cku.vercel.app" style={card}>
          <h2 style={title}>对外测试网址</h2>
          <p style={desc}>复制给测试者</p>
        </a>
      </div>

      <p style={{ marginTop: 16, opacity: 0.6 }}>
        下一步：建立 /english 与 /math 页面，点进去不再 404。
      </p>
    </main>
  );
}