"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ui } from "../ui";

export default function ArenaPage() {
  const router = useRouter();

  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>
        學習競技場
      </h1>

      <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡之後會放：對戰、排行榜、任務與成就（目前為入口框架）。
      </p>

      <div style={ui.grid2}>
        <div style={ui.card}>
          <h2 style={ui.cardTitle}>對戰（開發中）</h2>
          <p style={ui.cardDesc}>1v1、限時挑戰、題目隨機</p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>排行榜（開發中）</h2>
          <p style={ui.cardDesc}>排名、徽章、賽季積分</p>
        </div>
      </div>

      {/* 底部操作區：返回 */}
      <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          onClick={() => router.back()}
          style={{ ...ui.navBtn, cursor: "pointer" }}
        >
          ← 回上一頁
        </button>

        <Link href="/" style={ui.navBtn}>
          回首頁
        </Link>
      </div>
    </main>
  );
}