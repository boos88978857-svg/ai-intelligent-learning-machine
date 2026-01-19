import Link from "next/link";

export default function AdvancedPracticePage() {
  return (
    <main style={{ padding: 24 }}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>进阶练习</h1>
        <p style={{ margin: "8px 0 0", opacity: 0.7 }}>
          强化训练与挑战题型
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
          <li>进阶题库入口</li>
          <li>更高难度题目与解析</li>
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