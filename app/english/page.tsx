"use client";

import { useRouter } from "next/navigation";
import { ui } from "../ui";

export default function EnglishPage() {
  const router = useRouter();

  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>
        英文專區
      </h1>

      <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡是英文學習入口，之後會依程度（A1–C2）與能力模組逐步擴充。
      </p>

      <div style={ui.grid2}>
        <div style={ui.card}>
          <h2 style={ui.cardTitle}>基礎學習（開發中）</h2>
          <p style={ui.cardDesc}>
            單字、基礎文法、基本句型，適合初學與打底。
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>進階學習（開發中）</h2>
          <p style={ui.cardDesc}>
            閱讀理解、聽力、寫作，對應 B1–C2 程度。
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>英文練習</h2>
          <p style={ui.cardDesc}>
            進入做題模式，可中斷續做、不怕閃退或斷線。
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>發音與音標（規劃中）</h2>
          <p style={ui.cardDesc}>
            支援 KK 與 IPA 兩套音標，點哪個播哪個音。
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