"use client";

import { useRouter } from "next/navigation";
import { ui } from "../ui";

export default function RecordsPage() {
  const router = useRouter();
  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>記錄</h1>
      <div style={ui.card}>
        <h2 style={ui.cardTitle}>入口已打通 ✅</h2>
        <p style={ui.cardDesc}>之後放：做題歷史、正確率、停在哪一題、秒數、成就等。</p>
      </div>

      <button onClick={() => router.back()} style={ui.backLink}>
        ← 回上一頁
      </button>
    </main>
  );
}