// app/practice/session/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ui } from "../../ui";
import {
  clearSession,
  loadSession,
  saveSession,
  PracticeSession,
} from "../../lib/session";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// 先用假題目撐起「做題版面」與流程（之後再換成真題庫）
function getMockQuestions(subject: PracticeSession["subject"]) {
  if (subject === "英文") {
    return [
      "【英文】請選出正確的動詞時態：I ____ to school yesterday.",
      "【英文】請選出同義字：big = ?",
      "【英文】請選出正確介系詞：depend ____",
    ];
  }
  if (subject === "數學") {
    return [
      "【數學】2 + 3 = ?",
      "【數學】10 ÷ 2 = ?",
      "【數學】一個三角形內角和是多少度？",
    ];
  }
  return ["【其他】示範題：這裡之後可放其他學科題目。"];
}

export default function PracticeSessionPage() {
  const [session, setSession] = useState<PracticeSession | null>(null);
  const tickRef = useRef<number | null>(null);

  // 讀取續做進度
  useEffect(() => {
    const s = loadSession();
    setSession(s);
  }, []);

  const questions = useMemo(() => {
    if (!session) return [];
    return getMockQuestions(session.subject);
  }, [session]);

  // 計時器：只有「進行中」才加秒，並且每秒存檔一次
  useEffect(() => {
    if (!session) return;

    // 先清掉舊的 interval（保險）
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }

    if (session.paused) return;

    tickRef.current = window.setInterval(() => {
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

    return () => {
      if (tickRef.current) {
        window.clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [session?.paused, session?.id]);

  // 如果沒有 session（使用者直接輸入 /practice/session）
  if (!session) {
    return (
      <main>
        <h1 style={{ margin: "0 0 12px", fontSize: 28, fontWeight: 900 }}>
          做題中
        </h1>
        <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
          目前沒有可續做的進度，請先到學習區建立一個新進度。
        </p>
        <Link href="/practice" style={ui.navBtn}>
          前往學習區 →
        </Link>
      </main>
    );
  }

  const total = questions.length || 1;
  const index = Math.min(session.currentIndex, total - 1);
  const q = questions[index] ?? "（暫無題目）";

  function togglePause() {
    const next: PracticeSession = {
      ...session,
      paused: !session.paused,
      updatedAt: Date.now(),
    };
    saveSession(next);
    setSession(next);
  }

  function prevQ() {
    const nextIndex = Math.max(0, session.currentIndex - 1);
    const next: PracticeSession = {
      ...session,
      currentIndex: nextIndex,
      updatedAt: Date.now(),
    };
    saveSession(next);
    setSession(next);
  }

  function nextQ() {
    const nextIndex = Math.min(total - 1, session.currentIndex + 1);
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
    // 這裡直接導回續做中心
    window.location.href = "/practice";
  }

  return (
    <main>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>做題中</h1>
        <p style={{ margin: "8px 0 0", opacity: 0.75 }}>
          科目：{session.subject}　｜　題號：{index + 1}/{total}　｜　時間：
          {formatTime(session.elapsedSec)}　｜　狀態：
          {session.paused ? "已暫停" : "進行中"}
        </p>
      </header>

      {/* 題目卡片 */}
      <section style={ui.card}>
        <h2 style={ui.cardTitle}>題目</h2>
        <p style={{ ...ui.cardDesc, whiteSpace: "pre-wrap" }}>{q}</p>

        {/* 操作區 */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
          <button
            onClick={prevQ}
            style={{ ...ui.navBtn, cursor: "pointer" }}
            disabled={index === 0}
          >
            ← 上一題
          </button>

          <button
            onClick={nextQ}
            style={{ ...ui.navBtn, cursor: "pointer" }}
            disabled={index >= total - 1}
          >
            下一題 →
          </button>

          <button onClick={togglePause} style={{ ...ui.navBtn, cursor: "pointer" }}>
            {session.paused ? "繼續" : "暫停"}
          </button>
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/practice" style={ui.navBtn}>
            回學習區
          </Link>
          <button onClick={resetAll} style={{ ...ui.navBtn, cursor: "pointer" }}>
            結束並清除
          </button>
        </div>
      </section>
    </main>
  );
}