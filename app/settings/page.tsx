"use client";

import { useRouter } from "next/navigation";
import { ui } from "../ui";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>
        設定
      </h1>

      <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡可調整學習體驗與系統行為，後續會逐步開放各項設定功能。
      </p>

      <div style={ui.grid2}>
        <div style={ui.card}>
          <h2 style={ui.cardTitle}>顯示設定（規劃中）</h2>
          <p style={ui.cardDesc}>
            橫屏優先、字體大小、介面縮放比例。
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>聲音設定（規劃中）</h2>
          <p style={ui.cardDesc}>
            語音播放、音量大小、音效開關。
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>通知設定（規劃中）</h2>
          <p style={ui.cardDesc}>
            學習提醒、每日通知、活動推播。
         