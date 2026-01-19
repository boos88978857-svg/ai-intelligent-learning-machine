// app/practice/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ui } from "../ui";
import { clearSession, loadSession, newSession, saveSession, PracticeSession } from "../lib/session";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function PracticeHubPage() {
  const [session, setSession] = useState<PracticeSession | null>(null);

  useEffect(() => {
    setSession(loadSession());
  }, []);

  function start(subject: PracticeSession["subject"]) {
    const s = newSession(subject);
    saveSession(s);
    setSession(s);
    window.location.href = "/practice/session";
  }

  function resume() {
    window.location.href = "/practice/session";
  }

  function reset() {
    clearSession();
    setSession(null);
  }

  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>學習區</h1>
      <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡是「續做中心」：手機沒電、斷網、閃退，都不會讓你做到一半的題目消失。
      </p>

      {/* 有未完成進度 */}
      {session ? (
        <div style={ui.card}>
          <h2 style={ui.cardTitle}>未完成進度</h2>
          <p style={ui.cardDesc}>
            科目：{session.subject}
            <br />
            目前題號：第 {session.currentIndex + 1} 題
            <br />
            已用時間：{formatTime(session.elapsedSec)}
            <br />
            狀態：{session.paused ? "已暫停" : "進行中"}
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
            <button onClick={resume} style={{ ...ui.navBtn, cursor: "pointer" }}>
              繼續作答 →
            </button>
            <button onClick={reset} style={{ ...ui.navBtn, cursor: "pointer" }}>
              清除進度
            </button>
            <Link href="/" style={ui.navBtn}>回首頁</Link>
          </div>
        </div>
      ) : (
        <>
          {/* 沒有進度：提供開始入口 */}
          <div style={ui.grid2}>
            <button onClick={() => start("英文")} style={{ ...ui.card, textAlign: "left", cursor: "pointer" }}>
              <h2 style={ui.cardTitle}>開始英文練習</h2>
              <p style={ui.cardDesc}>建立一個新作答進度（可中斷續做）</p>
              <span style={ui.smallLink}>開始 →</span>
            </button>

            <button onClick={() => start("數學")} style={{ ...ui.card, textAlign: "left", cursor: "pointer" }}>
              <h2 style={ui.cardTitle}>開始數學練習</h2>
              <p style={ui.cardDesc}>建立一個新作答進度（可中斷續做）</p>
              <span style={ui.smallLink}>開始 →</span>
            </button>
          </div>

          <div style={{ marginTop: 14 }}>
            <Link href="/" style={ui.navBtn}>回首頁</Link>
          </div>
        </>
      )}
    </main>
  );
}