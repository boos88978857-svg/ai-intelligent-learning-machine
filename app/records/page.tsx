import Link from "next/link";
import { ui } from "../ui";

export default function RecordsPage() {
  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>記錄</h1>
      <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡之後會顯示：學習時長、完成題數、錯題本、進度趨勢、續做紀錄等。
      </p>

      <div style={ui.grid2}>
        <div style={ui.card}>
          <h2 style={ui.cardTitle}>學習概覽（開發中）</h2>
          <p style={ui.cardDesc}>今日/本週/本月統計、連續學習天數</p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>錯題本（開發中）</h2>
          <p style={ui.cardDesc}>收藏錯題、標註原因、再次練習</p>
        </div>
      </div>

      <p style={{ marginTop: 16 }}>
        <Link href="/" style={ui.navBtn}>回首頁</Link>
      </p>
    </main>
  );
}