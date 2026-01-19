// app/practice/session/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../../ui";
import { loadSession, saveSession, PracticeSession } from "../../lib/session";

/** ===== Step 2-1：題目資料結構（先固定格式） ===== */
type QuestionType = "choice" | "application";

type Question = {
  id: string;
  subject: string;
  type: QuestionType;
  prompt: string;
  options?: string[]; // choice 題才需要
  hint?: string;
  tools?: {
    whiteboard?: boolean;
    abacus?: boolean;
  };
};

// 假題目（示範用，之後會由題庫系統取代）
const mockQuestion: Question = {
  id: "demo-1",
  subject: "數學",
  type: "application",
  prompt: "小明有 12 顆糖，平均分給 3 個朋友，每人可以分到幾顆？",
  hint: "想想除法",
  tools: {
    whiteboard: true,
    abacus: true,
  },
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
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

      {/* 狀態卡 */}
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

        <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={togglePause} style={{ ...ui.navBtn, cursor: "pointer" }}>
            {session.paused ? "▶ 繼續" : "⏸ 暫停"}
          </button>

          <button onClick={back} style={{ ...ui.navBtn, cursor: "pointer" }}>
            ← 回上一頁
          </button>
        </div>
      </div>

      {/* Step 2-1 先只確認「題目資料」有被帶進來 */}
      <div style={{ marginTop: 16, opacity: 0.75 }}>
        <div>（除錯用）假題目已載入：{mockQuestion.id}</div>
        <div>題幹：{mockQuestion.prompt}</div>
        <div>提示：{mockQuestion.hint ?? "無"}</div>
        <div>
          工具：白板 {mockQuestion.tools?.whiteboard ? "開" : "關"} / 算盤{" "}
          {mockQuestion.tools?.abacus ? "開" : "關"}
        </div>
      </div>
    </main>
  );
}