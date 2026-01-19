// app/settings/page.tsx
"use client";

import { ui } from "../ui";
import BackButton from "../components/BackButton";

export default function SettingsPage() {
  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>
        設定
      </h1>

      <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡將管理你的學習體驗與偏好設定。後續會加入更多個人化選項，並記憶你的習慣。
      </p>

      <div style={ui.grid2}>
        <div style={ui.card}>
          <h2 style={ui.cardTitle}>發音與音標偏好（規劃中）</h2>
          <p style={ui.cardDesc}>
            預設音標：KK / IPA（國際音標）
            <br />
            點哪種音標就播放哪種音，系統會記住你的選擇。
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>顯示設定（規劃中）</h2>
          <p style={ui.cardDesc}>
            橫屏優先（App/平板）
            <br />
            直屏為輔助（使用者可自行切換）
            <br />
            字體大小、介面縮放
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>做題體驗（規劃中）</h2>
          <p style={ui.cardDesc}>
            暫停/繼續顯示
            <br />
            秒數計時顯示
            <br />
            中斷續做保護（沒電/斷網/閃退）
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>工具面板（規劃中）</h2>
          <p style={ui.cardDesc}>
            涂鴉牆可隱藏/展開，不影響題目版面
            <br />
            筆/橡皮擦大小、顏色、工具列手機隱藏
            <br />
            涂鴉時避免畫面跟著滑動
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>聲音設定（規劃中）</h2>
          <p style={ui.cardDesc}>
            語音播放音量
            <br />
            音效開關
            <br />
            自動播放/手動播放
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>帳號與資料（規劃中）</h2>
          <p style={ui.cardDesc}>
            使用者資料同步
            <br />
            學習記錄備份/還原
            <br />
            裝置切換延續進度
          </p>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <BackButton />
      </div>
    </main>
  );
}