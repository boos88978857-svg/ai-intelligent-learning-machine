// app/practice/session/session-client.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../../ui";
import {
  PracticeSession,
  getSession,
  upsertSession,
  removeSession,
  setActiveSessionId,
  getActiveSessionId,
} from "../../lib/session";

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

/** 測試題庫（示範用，之後改為你自建題庫） */
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
  {
    id: "other-1",
    subject: "其他",
    prompt: "(示範) 其他科目入口已打通：這題只是示範。",
    choices: [
      { id: "a", text: "選項 A", correct: true },
      { id: "b", text: "選項 B" },
      { id: "c", text: "選項 C" },
      { id: "d", text: "選項 D" },
    ],
    hints: ["這是示範提示 1", "這是示範提示 2", "這是示範提示 3", "這是示範提示 4", "這是示範提示 5"],
  },
];

export default function PracticeSessionClient({ id }: { id: string | null }) {
  const router = useRouter();

  // ✅ 優先使用 props 的 id，沒有才 fallback activeId
  const sessionId = useMemo(() => {
    return id ?? getActiveSessionId();
  }, [id]);

  const [session, setSession] = useState<PracticeSession | null>(null);

  // 每題互動狀態
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hintText, setHintText] = useState<string | null>(null);

  // 讀取回合
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

  function persist(next: PracticeSession) {
    upsertSession(next);
    setSession(next);
  }

  // 計時（暫停/完成就停）
  useEffect(() => {
    if (!session || session.paused || session.roundDone) return;

    const t = setInterval(() => {
      setSession((prev) => {
        if (!prev || prev.paused || prev.roundDone) return prev;
        const next = { ...prev, elapsedSec: prev.elapsedSec + 1 };
        upsertSession(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [session]);

  const currentQuestion = useMemo(() => {
    if (!session) return null;
    const pool = mockQuestions.filter((q) => q.subject === session.subject);
    const list = pool.length ? pool : mockQuestions;
    const idx = session.currentIndex % list.length;
    return list[idx];
  }, [session]);

  if (!session || !currentQuestion) return null;

  const totalQ = session.totalQuestions;
  const hintLimit = session.hintLimit;

  const correctCount = session.correctCount;
  const wrongCount = session.wrongCount;
  const hintsUsed = session.hintsUsed;

  const currentNo = session.currentIndex + 1;
  const shownNo = Math.min(currentNo, totalQ);
  const hintsLeft = Math.max(0, hintLimit - hintsUsed);

  const pillStyle: React.CSSProperties = { ...ui.pill, whiteSpace: "nowrap" };

  function togglePause() {
    const next = { ...session, paused: !session.paused };
    persist(next);
    if (next.paused) setMessage("已暫停。請點上方「▶ 繼續」後再操作。");
    else setMessage(null);
  }

  function selectChoice(cid: string) {
    if (session.paused || session.roundDone) return;
    if (hasSubmitted) return;
    setSelectedChoiceId(cid);
    setMessage(null);
  }

  function submit() {
    if (session.paused || session.roundDone) return;
    if (hasSubmitted) return;

    if (!selectedChoiceId) {
      setMessage("請先選擇一個答案。");
      return;
    }

    const picked = currentQuestion.choices.find((c) => c.id === selectedChoiceId);
    const isCorrect = !!picked?.correct;

    setHasSubmitted(true);

    if (isCorrect) {
      persist({ ...session, correctCount: correctCount + 1 });
      setMessage("答對了！請繼續下一題。");
      setHintText(null);
    } else {
      persist({ ...session, wrongCount: wrongCount + 1 });
      setMessage("很可惜，這題沒有答對。你可以再試一次或使用提示。");
    }
  }

  function useHint() {
    if (session.paused || session.roundDone) return;

    if (hintsLeft <= 0) {
      setHintText(`提示已用完（本回合上限 ${hintLimit} 次）。`);
      return;
    }

    const idx = hintsUsed;
    const text =
      currentQuestion.hints[idx] ??
      currentQuestion.hints[currentQuestion.hints.length - 1] ??
      "（暫無提示）";

    persist({ ...session, hintsUsed: hintsUsed + 1 });
    setHintText(text);
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

    if (currentNo >= totalQ) {
      persist({ ...session, roundDone: true, paused: false });
      setMessage(null);
      return;
    }

    persist({ ...session, currentIndex: session.currentIndex + 1 });

    setSelectedChoiceId(null);
    setHasSubmitted(false);
    setMessage(null);
    setHintText(null);
  }

  function goPractice() {
    router.replace("/practice");
  }

  function deleteThisSession() {
    removeSession(session.id);
    router.replace("/practice");
  }

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
            <button onClick={goPractice} style={{ ...ui.navBtn, cursor: "pointer" }}>
              回學習區
            </button>
            <button onClick={deleteThisSession} style={{ ...ui.navBtn, cursor: "pointer" }}>
              刪除此回合
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 10px", fontSize: 28, fontWeight: 900 }}>作答中</h1>

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
          <button onClick={() => router.back()} style={{ ...ui.navBtn, cursor: "pointer" }}>
            ← 回上一頁
          </button>
          <button onClick={goPractice} style={{ ...ui.navBtn, cursor: "pointer" }}>
            回學習區
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