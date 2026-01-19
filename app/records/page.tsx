"use client";

import { useRouter } from "next/navigation";
import { ui } from "../ui";

export default function RecordsPage() {
  const router = useRouter();

  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>
        記錄
      </h1>

      <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡會彙整你的學習歷程，包含作答進度、完成狀態與錯題紀錄。
      </p>

      <div style={ui.grid2}>
        <div style={ui.card}>
          <h2 style={ui.cardTitle}>學習進度（規劃中）</h2>
          <p style={ui.cardDesc}>
            各科完成比例、連續學習天數、每日學習時長。
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>續做紀錄（規劃中）</h2>
          <p style={ui.cardDesc}>
            曾中斷的題目，可快速回到作答畫面。
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>錯題本（規劃中）</h2>
          <p style={ui.cardDesc}>
            自動整理錯誤題目，方便重複練習與複習。
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>學習統計（規劃中）</h2>
          <p style={ui.cardDesc}>
            成績變化、正確率趨勢、科目分析。
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