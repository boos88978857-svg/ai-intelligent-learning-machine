// app/practice/session/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../../ui";
import { loadSession, saveSession, PracticeSession } from "../../lib/session";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
}

export default function PracticeSessionPage() {
  const router = useRouter();
  const [session, setSession] = useState<PracticeSession | null>(null);

  // 載入續做資料
  useEffect(() => {
    const s = loadSession();
    if (!s) {
      router.replace("/practice");
      return;
    }
    setSession(s);
  }, [router]);

  // 簡單計時（每秒 +1）
  useEffect(() => {
    if (!session || session.paused) return;

    const timer = setInterval(() => {
      setSession((prev) => {
        if (!prev) return prev;
        const next = { ...prev, elapsedSec: prev.elapsedSec + 1 };
        saveSession(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session]);

  if (!session) return null;

  function togglePause() {
    const next = { ...session, paused: !session.paused };
    saveSession(next);
    setSession(next);
  }

  function back() {
    router.back();
  }

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 28, fontWeight: 900 }}>
        作答中（{session.subject}）
      </h1>

      <div style={ui.card}>
        <p style={ui.cardDesc}>
          題號：第 {session.currentIndex + 1} 題
          <br />
          已用時間：{formatTime(session.elapsedSec)}
          <br />
          狀態：{session.paused ? "已暫停" : "進行中"}
        </p>

        <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
          <button
            onClick={togglePause}
            style={{ ...ui.navBtn, cursor: "pointer" }}
          >
            {session.paused ? "▶ 繼續" : "⏸ 暫停"}
          </button>

          <button
            onClick={back}
            style={{ ...ui.navBtn, cursor: "pointer" }}
          >
            ← 回上一頁
          </button>
        </div>
      </div>

      <div style={{ marginTop: 24, opacity: 0.6 }}>
        ※ 題目區塊（下一步才加入）
      </div>
    </main>
  );
}