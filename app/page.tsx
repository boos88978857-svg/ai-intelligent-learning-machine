import Link from "next/link";
import type { CSSProperties } from "react";

const wrap: CSSProperties = { padding: 24 };

const title: CSSProperties = { margin: 0, fontSize: 34, fontWeight: 800 };
const subtitle: CSSProperties = { margin: "8px 0 18px", opacity: 0.75 };

const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
  maxWidth: 900,
};

const card: CSSProperties = {
  display: "block",
  padding: 18,
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: 14,
  textDecoration: "none",
  color: "inherit",
  background: "white",
};

const cardTitle: CSSProperties = { margin: 0, fontSize: 26, fontWeight: 800 };
const cardDesc: CSSProperties = { margin: "10px 0 0", opacity: 0.75, lineHeight: 1.6 };

export default function Page() {
  return (
    <section style={wrap}>
      <h1 style={title}>AI 智能學習機</h1>
      <p style={subtitle}>請選擇入口開始學習</p>

      <div style={grid}>
        <Link href="/english" style={card}>
          <h2 style={cardTitle}>英文專區</h2>
          <p style={cardDesc}>A1–C2、TOEIC、學習＋練習</p>
        </Link>

        <Link href="/math" style={card}>
          <h2 style={cardTitle}>數學專區</h2>
          <p style={cardDesc}>國小／國中／高中分級練習</p>
        </Link>

        <Link href="/subjects" style={card}>
          <h2 style={cardTitle}>其他學科</h2>
          <p style={cardDesc}>之後擴充：國文、理化、歷史等</p>
        </Link>

        <Link href="/arena" style={card}>
          <h2 style={cardTitle}>學習競技場</h2>
          <p style={cardDesc}>對戰／排名／任務（入口先打通）</p>
        </Link>
      </div>
    </section>
  );
}