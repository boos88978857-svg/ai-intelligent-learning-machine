import Link from "next/link";
import { ui } from "./ui";

export default function HomePage() {
  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "6px 0 8px", fontSize: 40, fontWeight: 900 }}>
        AI 智能學習機
      </h1>
      <p style={{ margin: "0 0 18px", opacity: 0.75 }}>
        請選擇入口開始學習
      </p>

      <div style={ui.grid2}>
        <Link href="/english" style={ui.card}>
          <h2 style={ui.cardTitle}>英文專區</h2>
          <p style={ui.cardDesc}>A1–C2、TOEIC、學習 + 練習</p>
        </Link>

        <Link href="/math" style={ui.card}>
          <h2 style={ui.cardTitle}>數學專區</h2>
          <p style={ui.cardDesc}>國小 / 國中 / 高中分級練習</p>
        </Link>

        <Link href="/other" style={ui.card}>
          <h2 style={ui.cardTitle}>其他學科</h2>
          <p style={ui.cardDesc}>之後擴充：國文、理化、歷史等</p>
        </Link>

        <Link href="/arena" style={ui.card}>
          <h2 style={ui.cardTitle}>學習競技場</h2>
          <p style={ui.cardDesc}>對戰 / 排名 / 任務（入口先打通）</p>
        </Link>
      </div>
    </main>
  );
}
