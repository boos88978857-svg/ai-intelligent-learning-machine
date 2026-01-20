// app/page.tsx
import Link from "next/link";
import { ui } from "./ui";

export default function HomePage() {
  return (
    <main>
      <h1 style={{ margin: "0 0 10px", fontSize: 44, fontWeight: 900 }}>
        AI 智能學習機
      </h1>
      <p style={{ margin: "0 0 18px", color: "#555", fontWeight: 700 }}>
        請選擇入口開始學習
      </p>

      <div style={ui.grid2}>
        <Link href="/english" style={{ ...ui.card, textDecoration: "none" }}>
          <h2 style={ui.cardTitle}>英文專區</h2>
          <p style={ui.cardDesc}>A1–C2、TOEIC、學習＋練習</p>
        </Link>

        <Link href="/math" style={{ ...ui.card, textDecoration: "none" }}>
          <h2 style={ui.cardTitle}>數學專區</h2>
          <p style={ui.cardDesc}>國小 / 國中 / 高中分級練習</p>
        </Link>

        <Link href="/other" style={{ ...ui.card, textDecoration: "none" }}>
          <h2 style={ui.cardTitle}>其他學科</h2>
          <p style={ui.cardDesc}>之後擴充：國文、理化、歷史等</p>
        </Link>

        <Link href="/practice" style={{ ...ui.card, textDecoration: "none" }}>
          <h2 style={ui.cardTitle}>學習區</h2>
          <p style={ui.cardDesc}>只負責「續做 / 清除」</p>
        </Link>
      </div>
    </main>
  );
}