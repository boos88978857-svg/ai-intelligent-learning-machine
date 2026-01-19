// app/practice/session/session-client.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ui } from "../../ui";
import { loadSession, saveSession, PracticeSession } from "../../lib/session";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function PracticeSessionClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ 這裡才可以安全用 useSearchParams
  const subjectFromQuery = useMemo(() => {
    // 你如果沒用 query 也沒關係，留著不會壞
    return searchParams.get("subject");
  }, [searchParams]);

  const [session, setSession] = useState<PracticeSession | null>(null);

  useEffect(() => {
    const s = loadSession();
    if (!s) {
      router.replace("/practice");
      return;
    }

    // 如果你有想用 query 覆蓋 subject，可以在這裡做（不想用就刪掉這段）
    if (subjectFromQuery && s.subject !== subjectFromQuery) {
      const next = { ...s, subject: subjectFromQuery as any };
      saveSession(next);
      setSession(next);
      return;
    }

    setSession(s);
  }, [router, subjectFromQuery]);

  // 計時（每秒 +1）
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

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 28, fontWeight: 900 }}>
        作答中（{session.subject}）
      </h1>

      <div style={ui.card}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={ui.pill}>科目：{session.subject}</div>
          <div style={ui.pill}>
            第 {session.currentIndex + 1} 題 / {session.totalQuestions}
          </div>
          <div style={ui.pill}>⏱ {formatTime(session.elapsedSec)}</div>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={togglePause} style={ui.navBtn}>
            {session.paused ? "▶ 繼續" : "⏸ 暫停"}
          </button>

          <button onClick={() => router.back()} style={ui.navBtn}>
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