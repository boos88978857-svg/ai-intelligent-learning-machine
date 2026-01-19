// app/practice/session/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ui } from "../../ui";
import { clearSession, loadSession, saveSession, PracticeSession } from "../../lib/session";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function PracticeSessionPage() {
  const [session, setSession] = useState<PracticeSession | null>(null);

  // 假題庫（先做框架，之後換成真正題目來源）
  const questions = useMemo(() => {
    return [
      "題目 1：這是一個示範題目，先把介面與續做機制打通。",
      "題目 2：按「下一題」會保存目前題號與時間。",
      "題目 3：暫停後時間不會增加。",
    ];
  }, []);

  // 初次載入：讀取 session
  useEffect(() => {
    const s = loadSession();
    setSession(s);
  }, []);

  // 計時器：每秒 +1（未暫停才跑），並保存
  useEffect(() => {
    if (!session) return;
    if (session.paused) return;

    const t = setInterval(() => {
      setSession((prev) => {
        if (!prev) return prev;
        const next: PracticeSession = {
          ...prev,
          elapsedSec: prev.elapsedSec + 1,
          updatedAt: Date.now(),
        };
        saveSession(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [session?.id, session?.paused]);

  if (!session) {
    return (
      <main>
        <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>作答中</h1>
        <p style={{ margin: "0 0 16px", opacity: 0.75 }}>
          找不到作答進度，請回到學習區建立新進度。
        </p>
        <Link href="/practice" style={ui.navBtn}>回學習區</Link>
      </main>
    );
  }

  const qText = questions[Math.min(session.currentIndex, questions.length - 1)];

  function togglePause() {
    const next: PracticeSession = {
      ...session,
      paused: !session.paused,
      updatedAt: Date.now(),
    };
    saveSession(next);
    setSession(next);
  }

  function nextQuestion() {
    const nextIndex = Math.min(session.currentIndex + 1, questions.length - 1);
    const next: PracticeSession = {
      ...session,
      currentIndex: nextIndex,
      updatedAt: Date.now(),
    };
    saveSession(next);
    setSession(next);
  }

  function resetAll() {
    clearSession();
    window.location.href = "/practice";
  }

  return (
    <main>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900 }}>作答中（{session.subject}）</h1>
        <p style={{ margin: "8px 0 0", opacity: 0.75 }}>
          題號：第 {session.currentIndex + 1} 題　｜　時間：{formatTime(session.elapsedSec)}　｜　狀態：{session.paused ? "已暫停" : "進行中"}
        </p>
      </header>

      <section style={ui.card}>
        <h2 style={ui.cardTitle}>題目</h2>
        <p style={{ ...ui.cardDesc, fontSize: 18 }}>{qText}</p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
          <button onClick={togglePause} style={{ ...ui.navBtn, cursor: "pointer" }}>
            {session.paused ? "繼續" : "暫停"}
          </button>

          <button onClick={nextQuestion} style={{ ...ui.navBtn, cursor: "pointer" }}>
            下一題 →
          </button>

          <button onClick={resetAll} style={{ ...ui.navBtn, cursor: "pointer" }}>
            清除進度
          </button>

          <Link href="/practice" style={ui.navBtn}>回學習區</Link>
        </div>

        <p style={{ marginTop: 14, opacity: 0.6, lineHeight: 1.6 }}>
          ✅ 這頁每秒會自動保存（未暫停時）。就算手機沒電或閃退，再回來仍可續做。
        </p>
      </section>
    </main>
  );
}
