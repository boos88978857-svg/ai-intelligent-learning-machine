"use client";

import { useRouter } from "next/navigation";
import { ui } from "../ui";

export default function AboutPage() {
  const router = useRouter();
  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>關於</h1>
      <div style={ui.card}>
        <h2 style={ui.cardTitle}>AI 智能學習機</h2>
        <p style={ui.cardDesc}>版本：0.1（框架入口已完成）</p>
      </div>

      <button onClick={() => router.back()} style={ui.backLink}>
        ← 回上一頁
      </button>
    </main>
  );
}