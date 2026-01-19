import Link from "next/link";
import { ui } from "../ui";

export default function ArenaPage() {
  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>學習競技場</h1>
      <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡之後會放：對戰、排行榜、任務與成就（先把入口框架打通）。
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

      <p style={{ marginTop: 16 }}>
        <Link href="/" style={ui.navBtn}>回首頁</Link>
      </p>
    </main>
  );
}