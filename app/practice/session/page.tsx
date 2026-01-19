// app/practice/session/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../../ui";
import { loadSession, saveSession, PracticeSession } from "../../lib/session";

type QuestionType = "single";

type Question = {
  id: string;
  subject: PracticeSession["subject"];
  type: QuestionType;
  prompt: string;
  options: { id: string; text: string; correct?: boolean }[];
  hint: string;
  tools?: { whiteboard?: boolean; abacus?: boolean };
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function PracticeSessionPage() {
  const router = useRouter();
  const [session, setSession] = useState<PracticeSession | null>(null);

  // === Step 3 狀態：提示/答案/統計（先用 local state，之後再進階存回 session） ===
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // 提示 3 次上限
  const [hintUsed, setHintUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);

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

  // 假題目：先依科目顯示不同題幹（之後換題庫）
  const question: Question = useMemo(() => {
    if (!session) {
      return {
        id: "demo-1",
        subject: "英文",
        type: "single",
        prompt: "(示範) Which one is a fruit?",
        hint: "想想常見水果",
        options: [
          { id: "a", text: "Apple", correct: true },
          { id: "b", text: "Chair" },
          { id: "c", text: "Book" },
          { id: "d", text: "Shoe" },
        ],
        tools: { whiteboard: false, abacus: false },
      };
    }

    if (session.subject === "數學") {
      return {
        id: "demo-m-1",
        subject: "數學",
        type: "single",
        prompt: "(示範) 小明有 12 顆糖，平均分給 3 個朋友，每人可以分到幾顆？",
        hint: "想想除法",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "4", correct: true },
          { id: "c", text: "6" },
          { id: "d", text: "12" },
        ],
        tools: { whiteboard: true, abacus: true },
      };
    }

    // 英文
    return {
      id: "demo-e-1",
      subject: "英文",
      type: "single",
      prompt: "(示範) Which one is a fruit?",
      hint: "想想常見水果",
      options: [
        { id: "a", text: "Apple", correct: true },
        { id: "b", text: "Chair" },
        { id: "c", text: "Book" },
        { id: "d", text: "Shoe" },
      ],
      tools: { whiteboard: true, abacus: false },
    };
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

  function onSelect(id: string) {
    if (submitted) return;
    setSelectedId(id);
  }

  function submitAnswer() {
    if (!selectedId || submitted) return;
    setSubmitted(true);

    const picked = question.options.find((o) => o.id === selectedId);
    const ok = !!picked?.correct;
    if (ok) setCorrectCount((n) => n + 1);
    else setWrongCount((n) => n + 1);
  }

  function nextQuestion() {
    // 這裡先用「假下一題」：題號 +1、清掉作答狀態
    const next = { ...session, currentIndex: session.currentIndex + 1, paused: false };
    saveSession(next);
    setSession(next);

    setSelectedId(null);
    setSubmitted(false);
    setShowHint(false);
    // hintUsed 保留（同一次作答最多 3 次）
  }

  function useHint() {
    if (hintUsed >= 3) return;
    setHintUsed((n) => n + 1);
    setShowHint(true);
  }

  const hintLabel = `提示（3/${Math.min(hintUsed + 1, 3)}）`;
  const hintStatus = `提示次數：3/${hintUsed}`;

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
          <br />
          對：{correctCount} / 錯：{wrongCount}
          <br />
          {hintStatus}
        </p>

        <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={togglePause} style={{ ...ui.navBtn, cursor: "pointer" }}>
            {session.paused ? "▶ 繼續" : "⏸ 暫停"}
          </button>

          <button
            onClick={useHint}
            disabled={hintUsed >= 3}
            style={{
              ...ui.navBtn,
              cursor: hintUsed >= 3 ? "not-allowed" : "pointer",
              opacity: hintUsed >= 3 ? 0.5 : 1,
            }}
          >
            {hintLabel}
          </button>

          <button
            onClick={submitAnswer}
            disabled={!selectedId || submitted || session.paused}
            style={{
              ...ui.navBtn,
              cursor: !selectedId || submitted || session.paused ? "not-allowed" : "pointer",
              opacity: !selectedId || submitted || session.paused ? 0.5 : 1,
            }}
          >
            提交答案
          </button>

          <button
            onClick={nextQuestion}
            disabled={!submitted}
            style={{
              ...ui.navBtn,
              cursor: !submitted ? "not-allowed" : "pointer",
              opacity: !submitted ? 0.5 : 1,
            }}
          >
            下一題 →
          </button>

          <button onClick={back} style={{ ...ui.navBtn, cursor: "pointer" }}>
            ← 回上一頁
          </button>
        </div>
      </div>

      {/* 題目卡 */}
      <div style={{ ...ui.card, marginTop: 16 }}>
        <h2 style={ui.cardTitle}>題目</h2>
        <p style={ui.cardDesc}>{question.prompt}</p>

        {showHint && (
          <div style={{ ...ui.card, marginTop: 12, background: "#fff" as any }}>
            <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 800 }}>提示</h3>
            <p style={{ margin: 0, opacity: 0.85, lineHeight: 1.7 }}>{question.hint}</p>
          </div>
        )}

        <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
          {question.options.map((opt) => {
            const isPicked = selectedId === opt.id;
            const isCorrect = submitted && opt.correct;
            const isWrongPicked = submitted && isPicked && !opt.correct;

            return (
              <button
                key={opt.id}
                onClick={() => onSelect(opt.id)}
                disabled={session.paused}
                style={{
                  ...ui.card,
                  cursor: session.paused ? "not-allowed" : "pointer",
                  textAlign: "left",
                  outline: isPicked ? "2px solid rgba(29,78,216,0.6)" : "none",
                  background: isCorrect ? "rgba(34,197,94,0.12)" : isWrongPicked ? "rgba(239,68,68,0.10)" : "white",
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 18 }}>{opt.text}</div>
                {submitted && isCorrect && <div style={{ marginTop: 6, opacity: 0.8 }}>✅ 正確答案</div>}
                {submitted && isWrongPicked && <div style={{ marginTop: 6, opacity: 0.8 }}>❌ 你選錯了</div>}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 14, opacity: 0.6, lineHeight: 1.7 }}>
          ※ 白板 / 算盤：下一步會用「工具列」方式做成可開關的面板（先把題目與操作流程打通）。
        </div>
      </div>
    </main>
  );
}