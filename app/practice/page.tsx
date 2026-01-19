"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../ui";
import {
  loadAllSessions,
  newSession,
  removeSession,
} from "../lib/session";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function PracticeHubPage() {
  const router = useRouter();
  const [session, setSession] = useState<PracticeSession | null>(null);

  useEffect(() => {
    setSession(loadSession());
  }, []);

  function start(subject: Subject) {
    const s = newSession(subject);
    saveSession(s);
    setSession(s);
    router.push("/practice/session");
  }

  function resume() {
    router.push("/practice/session");
  }

  function remove(id: string) {
  removeSession(id);
  setSessions(loadAllSessions());
}

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>
        學習區
      </h1>
      <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡是「續做中心」：手機沒電、斷網、閃退，都不會讓你做到一半的題目消失。
      </p>

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
          </div>

          <button onClick={() => router.back()} style={ui.backLink}>
            ← 回上一頁
          </button>
        </div>
      ) : (
        <>
          <div style={ui.grid2}>
            <button
              onClick={() => start("英文")}
              style={{ ...ui.card, textAlign: "left", cursor: "pointer" }}
            >
              <h2 style={ui.cardTitle}>開始英文練習</h2>
              <p style={ui.cardDesc}>建立一個新作答進度（可中斷續做）</p>
            </button>

            <button
              onClick={() => start("數學")}
              style={{ ...ui.card, textAlign: "left", cursor: "pointer" }}
            >
              <h2 style={ui.cardTitle}>開始數學練習</h2>
              <p style={ui.cardDesc}>建立一個新作答進度（可中斷續做）</p>
            </button>
          </div>

          <button onClick={() => router.back()} style={ui.backLink}>
            ← 回上一頁
          </button>
        </>
      )}
    </main>
  );
}