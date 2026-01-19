"use client";

import { useRouter } from "next/navigation";
import { ui } from "../ui";

export default function AboutPage() {
  const router = useRouter();

  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>
        關於
      </h1>

      <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
        AI 智能學習機是一套以「學習不中斷」為核心理念的學習系統，
        結合學習內容、練習機制與續做設計，協助使用者穩定累積學習成果。
      </p>

      <div style={ui.grid2}>
        <div style={ui.card}>
          <h2 style={ui.cardTitle}>產品理念</h2>
          <p style={ui.cardDesc}>
            避免因斷線、沒電或意外中斷而失去學習進度，
            讓學習可以隨時暫停、隨時回來。
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>系統架構</h2>
          <p style={ui.cardDesc}>
            採用模組化設計，英文、數學與其他學科共用學習與續做機制，
            方便後續擴充與維護。
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>目前階段</h2>
          <p style={ui.cardDesc}>
            已完成入口框架與基礎學習流程，
            正逐步擴充課程內容與做題介面。
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>未來規劃</h2>
          <p style={ui.cardDesc}>
            英文分級學習、數學分齡題庫、學習競技場、
            個人化學習紀錄與分析。
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