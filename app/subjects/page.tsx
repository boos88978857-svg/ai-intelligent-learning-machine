"use client";

import { useRouter } from "next/navigation";
import { ui } from "../ui";

export default function SubjectsPage() {
  const router = useRouter();

  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>
        其他學科
      </h1>

      <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡將逐步擴充不同學科模組，統一使用相同的學習與續做機制。
      </p>

      <div style={ui.grid2}>
        <div style={ui.card}>
          <h2 style={ui.cardTitle}>國文（規劃中）</h2>
          <p style={ui.cardDesc}>
            閱讀理解、寫作練習、題型解析。
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>理化（規劃中）</h2>
          <p style={ui.cardDesc}>
            物理與化學基礎概念、圖表理解。
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>歷史（規劃中）</h2>
          <p style={ui.cardDesc}>
            時間軸、事件整理、題目練習。
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>地理（規劃中）</h2>
          <p style={ui.cardDesc}>
            地圖判讀、區域概念、題型練習。
          </p>
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