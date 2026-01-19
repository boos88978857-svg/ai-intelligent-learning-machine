import Link from "next/link";
import { ui } from "../ui";

export default function AboutPage() {
  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>關於</h1>
      <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
        AI 智能學習機：以「學習＋練習＋續做」為核心，逐步擴充英文、數學與競技功能。
      </p>

      <div style={ui.card}>
        <h2 style={ui.cardTitle}>版本資訊</h2>
        <p style={ui.cardDesc}>
          目前階段：入口框架與續做機制（MVP）<br />
          之後規劃：題庫、錯題本、排行榜、任務系統
        </p>
      </div>

      <p style={{ marginTop: 16 }}>
        <Link href="/" style={ui.navBtn}>回首頁</Link>
      </p>
    </main>
  );
}