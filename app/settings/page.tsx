"use client";

import { useRouter } from "next/navigation";
import { ui } from "../ui";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>設定</h1>

      <div style={ui.card}>
        <h2 style={ui.cardTitle}>偏好設定（先佔位）</h2>
        <p style={ui.cardDesc}>
          你提的「音標偏好」不是首頁卡片，是做題時由使用者自行切換，並由系統記憶習慣。
          <br />
          下一階段我會幫你把「偏好」做成可保存（localStorage → 之後換資料庫）。
        </p>
      </div>

      <button onClick={() => router.back()} style={ui.backLink}>
        ← 回上一頁
      </button>
    </main>
  );
}