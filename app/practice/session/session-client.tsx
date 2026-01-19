// app/practice/session/session-client.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ui } from "../../ui";
import { loadSession, saveSession, PracticeSession, clearSession } from "../../lib/session";

type Question = {
  id: string;
  subject: PracticeSession["subject"];
  prompt: string;
  choices: { id: string; text: string; correct?: boolean }[];
  hints: string[];
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/** 測試題庫（示範用） */
const mockQuestions: Question[] = [
  {
    id: "en-1",
    subject: "英文",
    prompt: "(示範) Which one is a fruit?",
    choices: [
      { id: "a", text: "Apple", correct: true },
      { id: "b", text: "Chair" },
      { id: "c", text: "Book" },
      { id: "d", text: "Shoe" },
    ],
    hints: ["想想常見水果", "它可以吃", "你可能在早餐看到它", "常見於果汁", "它不是家具"],
  },
  {
    id: "en-2",
    subject: "英文",
    prompt: "(示範) Which one is a color?",
    choices: [
      { id: "a", text: "Blue", correct: true },
      { id: "b", text: "Dog" },
      { id: "c", text: "Table" },
      { id: "d", text: "Milk" },
    ],
    hints: ["想想顏色", "天空常見", "也常拿來形容心情", "不是動物", "不是食物"],
  },
  {
    id: "math-1",
    subject: "數學",
    prompt: "(示範) 12 ÷ 3 = ?",
    choices: [
      { id: "a", text: "3" },
      { id: "b", text: "4", correct: true },
      { id: "c", text: "6" },
      { id: "d", text: "9" },
    ],
    hints: ["想想除法", "3 個人平均分", "每人拿一樣多", "12 是被分的數", "答案不是 3"],
  },
];

const TOTAL_PER_ROUND = 20;
const HINT_LIMIT = 5;

export default function PracticeSessionClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectFromQuery = useMemo(() => searchParams.get("subject"), [searchParams]);

  const [session, setSession] = useState<PracticeSession | null>(null);

  // 題目互動狀態（每題會重置）
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hintText, setHintText] = useState<string | null>(null);

  // 載入續做資料
  useEffect(() => {
    const s = loadSession();
    if (!s) {
      router.replace("/practice");
      return;
    }

    // ✅ 確保 session 內有我們需要的欄位（舊資料向下相容）
    const patched: PracticeSession = {
      ...s,
      totalQuestions: (s as any).totalQuestions ?? TOTAL_PER_ROUND,
      hintLimit: (s as any).hintLimit ?? HINT_LIMIT,
      correctCount: (s as any).correctCount ?? 0,
      wrongCount: (s as any).wrongCount ?? 0,
      hintsUsed: (s as any).hintsUsed ?? 0,
      roundDone: (s as any).roundDone ?? false,
    } as any;

    // 可選：subject 由 query 覆蓋（你之後做多回合時會用到）
    if (subjectFromQuery && patched.subject !== (subjectFromQuery as any)) {
      const next = { ...patched, subject: subjectFromQuery as any };
      saveSession(next);
      setSession(next);
      return;
    }

    // 寫回修補後版本
    saveSession(patched);
    setSession(patched);
  }, [router, subjectFromQuery]);

  // 計時（暫停就停；回合完成也停）
  useEffect(() => {
    if (!session || session.paused || session.roundDone) return;

    const timer = setInterval(() => {
      setSession((prev) => {
        if (!prev || prev.paused || prev.roundDone) return prev;
        const next = { ...prev, elapsedSec: prev.elapsedSec + 1 };
        saveSession(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session]);

  const currentQuestion = useMemo(() => {
    if (!session) return null;
    const pool = mockQuestions.filter((q) => q.subject === session.subject);
    const list = pool.length ? pool : mockQuestions;
    const idx = session.currentIndex % list.length;
    return list[idx];
  }, [session]);

  if (!session || !currentQuestion) return null;

  const currentNo = session.currentIndex + 1;
  const shownNo = Math.min(currentNo, session.totalQuestions ?? TOTAL_PER_ROUND);
  const totalQ = session.totalQuestions ?? TOTAL_PER_ROUND;
  const hintLimit = session.hintLimit ?? HINT_LIMIT;

  const correctCount = session.correctCount ?? 0;
  const wrongCount = session.wrongCount ?? 0;
  const hintsUsed = session.hintsUsed ?? 0;
  const hintsLeft = Math.max(0, hintLimit - hintsUsed);

  function persist(next: PracticeSession) {
    saveSession(next);
    setSession(next);
  }

  function togglePause() {
    const next = { ...session, paused: !session.paused };
    persist(next);

    if (next.paused) setMessage("已暫停。請點上方「▶ 繼續」後再操作。");
    else setMessage(null);
  }

  function back() {
    router.back();
  }

  function selectChoice(choiceId: string) {
    if (session.paused || session.roundDone) return;
    if (hasSubmitted) return; // 提交後不允許改選
    setSelectedChoiceId(choiceId);
    setMessage(null);
  }

  function submit() {
    if (session.paused || session.roundDone) return;
    if (hasSubmitted) return; // ✅ 防重複計分

    if (!selectedChoiceId) {
      setMessage("請先選擇一個答案。");
      return;
    }

    const picked = currentQuestion.choices.find((c) => c.id === selectedChoiceId);
    const isCorrect = !!picked?.correct;

    setHasSubmitted(true);

    if (isCorrect) {
      const next = { ...session, correctCount: correctCount + 1 };
      persist(next);
      setMessage("答對了！請繼續下一題。");
      setHintText(null);
    } else {
      const next = { ...session, wrongCount: wrongCount + 1 };
      persist(next);
      setMessage("很可惜，這題沒有答對。你可以再試一次或使用提示。");
    }
  }

  function useHint() {
    if (session.paused || session.roundDone) return;

    if (hintsLeft <= 0) {
      setHintText(`提示已用完（本回合上限 ${hintLimit} 次）。`);
      return;
    }

    const idx = hintsUsed; // 0-based
    const text =
      currentQuestion.hints[idx] ??
      currentQuestion.hints[currentQuestion.hints.length - 1] ??
      "（暫無提示）";

    const next = { ...session, hintsUsed: hintsUsed + 1 };
    persist(next);

    setHintText(text); // 覆蓋前一次提示
  }

  function nextQuestion() {
    if (session.paused || session.roundDone) return;

    if (!selectedChoiceId) {
      setMessage("請先選擇一個答案。");
      return;
    }
    if (!hasSubmitted) {
      setMessage("請先提交答案。");
      return;
    }

    // ✅ 回合結束
    if (currentNo >= totalQ) {
      const next = { ...session, roundDone: true };
      persist(next);
      setMessage(null);
      return;
    }

    const next = { ...session, currentIndex: session.currentIndex + 1 };
    persist(next);

    // 重置本題狀態
    setSelectedChoiceId(null);
    setHasSubmitted(false);
    setMessage(null);
    setHintText(null);
  }

  function finishRoundGoPractice() {
    // 先清掉本回合續做（你要保留已完成紀錄也可以改成只標記完成不清）
    clearSession();
    router.replace("/practice");
  }

  const pillStyle: React.CSSProperties = {
    ...ui.pill,
    whiteSpace: "nowrap",
  };

  if (session.roundDone) {
    return (
      <main style={ui.wrap}>
        <h1 style={{ margin: "0 0 12px", fontSize: 28, fontWeight: 900 }}>回合完成 ✅</h1>

        <div style={ui.card}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>統計</h2>
          <p style={{ margin: "10px 0 0", opacity: 0.8, lineHeight: 1.7 }}>
            科目：{session.subject}
            <br />
            題數：{totalQ}
            <br />
            對：{correctCount}　錯：{wrongCount}
            <br />
            提示：{hintLimit}/{hintsUsed}
            <br />
            總用時：{formatTime(session.elapsedSec)}
          </p>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={finishRoundGoPractice} style={{ ...ui.navBtn, cursor: "pointer" }}>
              回學習區
            </button>
            <button onClick={() => router.replace("/")} style={{ ...ui.navBtn, cursor: "pointer" }}>
              回首頁
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 10px", fontSize: 28, fontWeight: 900 }}>作答中</h1>

      {/* 狀態卡 */}
      <div style={ui.card}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div style={pillStyle}>科目：{session.subject}</div>
          <div style={pillStyle}>
            第 {shownNo} / {totalQ}
          </div>
          <div style={pillStyle}>⏱ {formatTime(session.elapsedSec)}</div>
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={togglePause} style={{ ...ui.navBtn, cursor: "pointer" }}>
            {session.paused ? "▶ 繼續" : "⏸ 暫停"}
          </button>
          <button onClick={back} style={{ ...ui.navBtn, cursor: "pointer" }}>
            ← 回上一頁
          </button>
        </div>

        {session.paused && (
          <div style={{ ...ui.card, marginTop: 12, background: "#fff" }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>提醒</h3>
            <p style={{ margin: "8px 0 0", opacity: 0.8, lineHeight: 1.7 }}>
              已暫停。請點上方「▶ 繼續」後再操作。
            </p>
          </div>
        )}
      </div>

      {/* 題目卡 */}
      <div style={{ ...ui.card, marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>題目</h2>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <div style={{ ...pillStyle, padding: "8px 12px" }}>對 {correctCount}</div>
            <div style={{ ...pillStyle, padding: "8px 12px" }}>錯 {wrongCount}</div>
            <div style={{ ...pillStyle, padding: "8px 12px" }}>
              提示 {hintLimit}/{hintsUsed}
            </div>
          </div>
        </div>

        <p style={{ margin: "10px 0 12px", lineHeight: 1.7 }}>{currentQuestion.prompt}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {currentQuestion.choices.map((c) => {
            const active = selectedChoiceId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => selectChoice(c.id)}
                disabled={session.paused}
                style={{
                  ...ui.card,
                  cursor: session.paused ? "not-allowed" : "pointer",
                  textAlign: "left",
                  border: active ? "2px solid rgba(29,78,216,0.55)" : (ui.card as any).border,
                  background: active ? "rgba(29,78,216,0.06)" : "white",
                  opacity: session.paused ? 0.6 : 1,
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 900 }}>{c.text}</div>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={useHint}
            disabled={session.paused}
            style={{
              ...ui.navBtn,
              cursor: session.paused ? "not-allowed" : "pointer",
              opacity: session.paused ? 0.6 : 1,
            }}
          >
            💡 提示（{hintLimit}/{hintsUsed}）
          </button>

          <button
            onClick={submit}
            disabled={session.paused || hasSubmitted}
            style={{
              ...ui.navBtn,
              cursor: session.paused || hasSubmitted ? "not-allowed" : "pointer",
              opacity: session.paused || hasSubmitted ? 0.6 : 1,
            }}
          >
            ✅ 提交答案
          </button>

          <button
            onClick={nextQuestion}
            disabled={session.paused || !hasSubmitted}
            style={{
              ...ui.navBtn,
              cursor: session.paused || !hasSubmitted ? "not-allowed" : "pointer",
              opacity: session.paused || !hasSubmitted ? 0.6 : 1,
            }}
          >
            下一題 →
          </button>
        </div>

        {hintText && (
          <div style={{ ...ui.card, marginTop: 12, background: "#fff" }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>
              提示（{hintLimit}/{hintsUsed}）
            </h3>
            <p style={{ margin: "8px 0 0", opacity: 0.8, lineHeight: 1.7 }}>{hintText}</p>
          </div>
        )}

        {message && (
          <div style={{ ...ui.card, marginTop: 12, background: "#fff" }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>訊息</h3>
            <p style={{ margin: "8px 0 0", opacity: 0.8, lineHeight: 1.7 }}>{message}</p>
          </div>
        )}
      </div>
    </main>
  );
}