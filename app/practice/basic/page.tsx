import Link from "next/link";

export default function BasicPracticePage() {
  return (
    <main style={{ padding: 24 }}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>基础练习</h1>
        <p style={{ margin: "8px 0 0", opacity: 0.7 }}>
          入门与基础题型训练
        </p>
      </header>

      <section
        style={{
          padding: 16,
          border: "1px solid rgba(0,0,0,0.15)",
          borderRadius: 12,
        }}
      >
        <h2 style={{ marginTop: 0 }}>本页将放什么？</h2>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>题目列表（可点进题目）</li>
          <li>作答区</li>
          <li>涂鸦墙（后面做）</li>
        </ul>
      </section>

      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <Link href="/practice">← 回练习区</Link>
        <Link href="/">回首页</Link>
      </div>
    </main>
  );
}