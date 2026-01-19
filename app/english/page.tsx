"use client";

import { useRouter } from "next/navigation";
import { ui } from "../ui";

export default function EnglishPage() {
  const router = useRouter();
  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>英文專區</h1>
      <div style={ui.card}>
        <h2 style={ui.cardTitle}>入口已打通 ✅</h2>
        <p style={ui.cardDesc}>接下來把你的課程、題庫、音標偏好（使用者習慣記憶）接進來。</p>
      </div>

      <button onClick={() => router.back()} style={ui.backLink}>
        ← 回上一頁
      </button>
    </main>
  );
}