"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../../ui";
import { loadSession, saveSession, clearSession, PracticeSession } from "../../lib/session";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function PracticeSessionPage() {
  const router = useRouter();
  const [session, setSession] = useState<PracticeSession | null>(null);

  useEffect(() => {
    setSession(loadSession());
  }, []);

  useEffect(() => {
    if (!session) return;
    if (session.paused) return;

    const t = setInterval(() => {
      setSession((prev) => {
        if (!prev) return prev;
        const next = { ...prev, elapsedSec: prev.elapsedSec + 1, updatedAt: Date.now() };
        saveSession(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [session]);

  const questionText = useMemo(() => {
    if (!session) return "";
    return `（示範題）${session.subject} 第 ${session.currentIndex + 1} 題：這裡之後換成你的題庫。`;
  }, [session]);

  if (!session) {
    return (
      <main style={ui.wrap}>
        <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>
          作答中
        </h1>
        <p style={{ opacity: 0.75 }}>
          找不到作答進度，請回到「學習區」建立新進度。
        </p>
        <button onClick={() => router.push("/practice")} style={{ ...ui.navBtn, cursor: "pointer" }}>
          前往學習區 →
        </button>
      </main>
    );
  }

  function togglePause() {
    const next = { ...session, paused: !session.paused, updatedAt: Date.now() };
    saveSession(next);
    setSession(next);
  }

  function nextQ() {
    const next = { ...session, currentIndex: session.currentIndex + 1, updatedAt: Date.now() };
    saveSession(next);
    setSession(next);
  }

  function resetAll() {
    clearSession();
    router.push("/practice");
  }

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>
        作答中
      </h1>

      <div style={ui.card}>
        <h2 style={ui.cardTitle}>狀態</h2>
        <p style={ui.cardDesc}>
          科目：{session.subject}
          <br />
          題號：第 {session.currentIndex + 1} 題
          <br />
          計時：{formatTime(session.elapsedSec)}
          <br />
          狀態：{session.paused ? "已暫停" : "進行中"}
        </p>
      </div>

      <div style={{ height: 12 }} />

      <div style={ui.card}>
        <h2 style={ui.cardTitle}>題目</h2>
        <p style={ui.cardDesc}>{questionText}</p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
          <button onClick={togglePause} style={{ ...ui.navBtn, cursor: "pointer" }}>
            {session.paused ? "繼續" : "暫停"}
          </button>
          <button onClick={nextQ} style={{ ...ui.navBtn, cursor: "pointer" }}>
            下一題 →
          </button>
          <button onClick={resetAll} style={{ ...ui.navBtn, cursor: "pointer" }}>
            結束並回學習區
          </button>
        </div>
      </div>

      <button onClick={() => router.back()} style={ui.backLink}>
        ← 回上一頁
      </button>
    </main>
  );
}