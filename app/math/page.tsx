"use client";

import { useRouter } from "next/navigation";
import { ui } from "../ui";

export default function MathPage() {
  const router = useRouter();

  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>
        數學專區
      </h1>

      <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
        依學制分級的數學學習入口，後續會接上題庫與續做機制。
      </p>

      <div style={ui.grid2}>
        <div style={ui.card}>
          <h2 style={ui.cardTitle}>國小數學</h2>
          <p style={ui.cardDesc}>小一至小六，基礎運算與應用題。</p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>國中數學</h2>
          <p style={ui.cardDesc}>代數、幾何、函數基礎。</p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>高中數學</h2>
          <p style={ui.cardDesc}>進階函數、微積分、統計。</p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>數學練習</h2>
          <p style={ui.cardDesc}>進入做題模式，可中斷續做。</p>
        </div>
      </div>

      {/* 只保留回上一頁 */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => router.back()}
          style={{ ...ui.navBtn, cursor: "pointer" }}
        >
          ← 回上一頁
        </button>
      </div>
    </main>
  );
}