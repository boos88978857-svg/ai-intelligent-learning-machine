// app/practice/session/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ui } from "../../ui";
import {
  PracticeSession,
  getActiveSessionId,
  getSession,
  setActiveSessionId,
  upsertSession,
} from "../../lib/session";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function PracticeSessionPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const sessionId = useMemo(() => {
    const id = sp.get("id");
    return id ?? getActiveSessionId();
  }, [sp]);

  const [session, setSession] = useState<PracticeSession | null>(null);

  // 載入回合
  useEffect(() => {
    if (!sessionId) {
      router.replace("/practice");
      return;
    }
    const s = getSession(sessionId);
    if (!s) {
      router.replace("/practice");
      return;
    }
    setActiveSessionId(s.id);
    setSession(s);
  }, [router, sessionId]);

  // 計時（未暫停 + 未完成才計）
  useEffect(() => {
    if (!session || session.paused || session.roundDone) return;

    const timer = setInterval(() => {
      setSession((prev) => {
        if (!prev || prev.paused || prev.roundDone) return prev;
        const next: PracticeSession = { ...prev, elapsedSec: prev.elapsedSec + 1 };
        upsertSession(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session]);

  if (!session) return null;

  function togglePause() {
    const next: PracticeSession = { ...session, paused: !session.paused };
    upsertSession(next);
    setSession(next);
  }

  function back() {
    router.back();
  }

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 30, fontWeight: 900 }}>
        作答中
      </h1>

      {/* 狀態卡 */}
      <div style={ui.card}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={ui.pill}>科目：{session.subject}</div>
          <div style={ui.pill}>第 {session.currentIndex + 1} 題 / {session.totalQuestions}</div>
          <div style={ui.pill}>⏱ {formatTime(session.elapsedSec)}</div>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={togglePause} style={{ ...ui.navBtn, cursor: "pointer" }}>
            {session.paused ? "▶ 繼續" : "⏸ 暫停"}
          </button>

          <button onClick={back} style={{ ...ui.navBtn, cursor: "pointer" }}>
            ← 回上一頁
          </button>
        </div>

        {/* 暫停提醒卡：只有暫停時才出現 */}
        {session.paused && (
          <div style={{ ...ui.card, marginTop: 12, background: "#fff" }}>
            <h3 style={{ ...ui.cardTitle, fontSize: 18 }}>提醒</h3>
            <p style={ui.cardDesc}>已暫停。請點上方「▶ 繼續」後再操作。</p>
          </div>
        )}
      </div>

      {/* 先留題目區接口：你下一步要接題型/提示/提交/下一題/回合結束 */}
      <div style={{ marginTop: 16, opacity: 0.7 }}>
        ※ 下一步：接「題目區」與「作答區」（選擇題/填空/應用題都可）
      </div>
    </main>
  );
}