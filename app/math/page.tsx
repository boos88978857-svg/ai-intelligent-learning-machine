"use client";

import { useRouter } from "next/navigation";
import { ui } from "../ui";

export default function MathPage() {
  const router = useRouter();

  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>
        數學專區
      </h1>

      <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡是數學學習入口，依學制分級，之後會接上做題模式與續做機制。
      </p>

      <div style={ui.grid2}>
        <div style={ui.card}>
          <h2 style={ui.cardTitle}>國小數學（開發中）</h2>
          <p style={ui.cardDesc}>
            基礎運算、應用題，對應小一至小六。
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>國中數學（開發中）</h2>
          <p style={ui.cardDesc}>
            代數、幾何、函數，對應國一至國三。
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>高中數學（開發中）</h2>
          <p style={ui.cardDesc}>
            進階函數、微積分、統計，對應高一至高三。
          </p>
        </div>

        <div style={ui.card}>
          <h2 style={ui.cardTitle}>數學練習</h2>
          <p style={ui.cardDesc}>
            進入做題模式，可中斷續做，不怕沒電或斷線。
          </