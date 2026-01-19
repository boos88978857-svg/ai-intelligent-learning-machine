import Link from "next/link";

const cardStyle: React.CSSProperties = {
  display: "block",
  padding: 16,
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: 12,
  textDecoration: "none",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 12,
};

export default function PracticePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>练习区</h1>
      <p style={{ marginTop: 8, marginBottom: 16 }}>
        请选择你要进入的练习模块：
      </p>

      <div style={gridStyle}>
        <Link href="/practice/basic" style={cardStyle}>
          <h2 style={{ margin: 0 }}>基础练习</h2>
          <p style={{ margin: "8px 0 0", opacity: 0.7 }}>
            适合入门、打基础
          </p>
        </Link>

        <Link href="/practice/advanced" style={cardStyle}>
          <h2 style={{ margin: 0 }}>进阶练习</h2>
          <p style={{ margin: "8px 0 0", opacity: 0.7 }}>
            进阶挑战、强化训练
          </p>
        </Link>
      </div>

      <div style={{ marginTop: 20 }}>
        <Link href="/">← 回首页</Link>
      </div>
    </main>
  );
}