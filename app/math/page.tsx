"use client";

import { useRouter } from "next/navigation";
import { ui } from "../ui";

export default function MathPage() {
  const router = useRouter();
  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>數學專區</h1>
      <div style={ui.card}>
        <h2 style={ui.cardTitle}>入口已打通 ✅</h2>
        <p style={ui.cardDesc}>之後加上分級題庫：國小 / 國中 / 高中。</p>
      </div>

      <button onClick={() => router.back()} style={ui.backLink}>
        ← 回上一頁
      </button>
    </main>
  );
}