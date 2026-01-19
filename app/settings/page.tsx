import Link from "next/link";
import { ui } from "../ui";

export default function SettingsPage() {
  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>設定</h1>
      <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡之後會放：音效、語音、顯示模式（橫/直）、通知、帳號等設定。
      </p>

      <div style={ui.grid2}>
        <div style={ui.card}>
          <h2 style={ui.cardTitle}>顯示設定（開發中）</h2>
          <p style={ui.cardDesc}>橫屏優先、字體大小、介面縮放</p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>聲音設定（開發中）</h2>
          <p style={ui.cardDesc}>語音播放、音量、音效開關</p>
        </div>
      </div>

      <p style={{ marginTop: 16 }}>
        <Link href="/" style={ui.navBtn}>回首頁</Link>
      </p>
    </main>
  );
}