// app/practice/session/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../../ui";
import { loadSession, saveSession, PracticeSession } from "../../lib/session";

/** 題型（先示範：選擇題） */
type QuestionType = "mcq";

type Question = {
  id: string;
  subject: PracticeSession["subject"];
  type: QuestionType;
  prompt: string;
  choices: { id: string; text: string; correct?: boolean }[];
  hint: string[]; // 提示可多段（之後 Step 5 會接 5 次上限）
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/** 假題庫（示範用）：之後會由題庫系統取代 */
const mockQuestions: Question[] = [
  {
    id: "demo-en-1",
    subject: "英文",
    type: "mcq",
    prompt: "(示範) Which one is a fruit?",
    choices: [
      { id: "a", text: "Apple", correct: true },
      { id: "b", text: "Chair" },
      { id: "c", text: "Book" },
      { id: "d", text: "Shoe" },
    ],
    hint: ["想想常見水果", "它可以吃", "你可能在早餐看到它"],
  },
  {
    id: "demo-en-2",
    subject: "英文",
    type: "mcq",
    prompt: "(示範) Which one is a color?",
    choices: [
      { id: "a", text: "Blue", correct: true },
      { id: "b", text: "Dog" },
      { id: "c", text: "Table" },
      { id: "d", text: "Milk" },
    ],
    hint: ["想想顏色", "天空常見", "也常拿來形容心情"],
  },
  {
    id: "demo-math-1",
    subject: "數學",
    type: "mcq",
    prompt: "(示範) 12 ÷ 3 = ?",
    choices: [
      { id: "a", text: "3" },
      { id: "b", text: "4", correct: true },
      { id: "c", text: "6" },
      { id: "d", text: "9" },
    ],
    hint: ["想想除法", "3 個人平均分", "每人拿到一樣多"],
  },
];

export default function PracticeSessionPage() {
  const router = useRouter();
  const [session, setSession] = useState<PracticeSession | null>(null);

  /** 作答狀態（Step 4 重點） */
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 載入續做資料
  useEffect(() => {
    const s = loadSession();
    if (!s) {
      router.replace("/practice");
      return;
    }
    setSession(s);
  }, [router]);

  // 計時（暫停就停）
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

  const currentQuestion = useMemo(() => {
    if (!session) return null;
    // 依科目挑題（示範）
    const pool = mockQuestions.filter((q) => q.subject === session.subject);
    // 如果沒有該科目題，就拿全部
    const list = pool.length ? pool : mockQuestions;
    const idx = session.currentIndex % list.length;
    return list[idx];
  }, [session]);

  if (!session || !currentQuestion) return null;

  const totalPerRound = 20; // 每回合 20 題（你設定的）
  const currentNo = Math.min(session.currentIndex + 1, totalPerRound);

  /** 暫停/繼續 */
  function togglePause() {
    const next = { ...session, paused: !session.paused };
    saveSession(next);
    setSession(next);

    // 暫停時顯示提醒卡；繼續時清掉提醒卡
    if (!next.paused) {
      // 恢復
      setMessage(null);
    } else {
      // 暫停
      setMessage("已暫停。請點上方「▶ 繼續」後再操作。");
    }
  }

  /** 回上一頁（不受暫停影響） */
  function back() {
    router.back();
  }

  /** 點選答案（暫停時禁止） */
  function selectChoice(choiceId: string) {
    if (session.paused) return; // ✅ Step 4：暫停時禁止操作
    setSelectedChoiceId(choiceId);
    setMessage(null);
    setHasSubmitted(false);
  }

  /** 提交答案（暫停時禁止；沒選不能提交） */
  function submit() {
    if (session.paused) return; // ✅ 暫停禁止
    if (!selectedChoiceId) {
      setMessage("請先選擇一個答案。");
      return;
    }

    const picked = currentQuestion.choices.find((c) => c.id === selectedChoiceId);
    const isCorrect = !!picked?.correct;

    setHasSubmitted(true);

    if (isCorrect) {
      setMessage("答對了！準備進入下一題…");
      // 這裡先不做延遲跳題（之後 Step 5/6 我們再做更自然的節奏）
    } else {
      setMessage("很可惜，這題沒有答對。你可以再試一次或使用提示。");
    }
  }

  /** 下一題（暫停時禁止；未提交/未選答案禁止） */
  function nextQuestion() {
    if (session.paused) return; // ✅ 暫停禁止

    // ✅ Step 4：擋住沒作答就下一題
    if (!selectedChoiceId) {
      setMessage("請先選擇一個答案。");
      return;
    }
    if (!hasSubmitted) {
      setMessage("請先提交答案。");
      return;
    }

    // 進下一題：清狀態
    const next = {
      ...session,
      currentIndex: session.currentIndex + 1,
    };
    saveSession(next);
    setSession(next);

    setSelectedChoiceId(null);
    setHasSubmitted(false);
    setMessage(null);
  }

  /** 版面：把狀態做成緊湊（你希望不要滑） */
  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 10px", fontSize: 28, fontWeight: 900 }}>
        作答中
      </h1>

      {/* 狀態卡（更緊湊） */}
      <div style={ui.card}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div style={{ ...ui.navBtn, display: "flex", justifyContent: "center" }}>
            科目：{session.subject}
          </div>
          <div style={{ ...ui.navBtn, display: "flex", justifyContent: "center" }}>
            第 {currentNo} 題 / {totalPerRound}
          </div>
          <div style={{ ...ui.navBtn, display: "flex", justifyContent: "center" }}>
            ⏱ {formatTime(session.elapsedSec)}
          </div>
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={togglePause}
            style={{ ...ui.navBtn, cursor: "pointer" }}
          >
            {session.paused ? "▶ 繼續" : "⏸ 暫停"}
          </button>

          <button onClick={back} style={{ ...ui.navBtn, cursor: "pointer" }}>
            ← 回上一頁
          </button>
        </div>

        {/* ✅ 暫停提醒卡：只有按下暫停後才顯示 */}
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
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>題目</h2>

          {/* 這裡先留位置：之後 Step 5 放 提示 5/0 */}
          <div style={{ ...ui.navBtn, opacity: 0.7 }}>提示：5/0</div>
        </div>

        <p style={{ margin: "10px 0 12px", lineHeight: 1.7 }}>
          {currentQuestion.prompt}
        </p>

        {/* 選項（可點、可高亮；暫停時禁止點） */}
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
                  border: active ? "2px solid rgba(29,78,216,0.55)" : ui.card.border,
                  background: active ? "rgba(29,78,216,0.06)" : "white",
                  opacity: session.paused ? 0.6 : 1,
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 900 }}>{c.text}</div>
                {active && (
                  <div style={{ marginTop: 6, opacity: 0.65, fontSize: 14 }}>
                    已選取
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 操作列：提示 / 提交 / 下一題（Step 4 先做防呆） */}
        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            disabled={session.paused}
            style={{
              ...ui.navBtn,
              cursor: session.paused ? "not-allowed" : "pointer",
              opacity: session.paused ? 0.6 : 1,
            }}
            onClick={() => {
              if (session.paused) return;
              setMessage("（提示示範）想想常見水果。"); // Step 5 再做 5 次 / 覆蓋邏輯
            }}
          >
            💡 提示（5/0）
          </button>

          <button
            onClick={submit}
            disabled={session.paused}
            style={{
              ...ui.navBtn,
              cursor: session.paused ? "not-allowed" : "pointer",
              opacity: session.paused ? 0.6 : 1,
            }}
          >
            ✅ 提交答案
          </button>

          <button
            onClick={nextQuestion}
            disabled={session.paused}
            style={{
              ...ui.navBtn,
              cursor: session.paused ? "not-allowed" : "pointer",
              opacity: session.paused ? 0.6 : 1,
            }}
          >
            下一題 →
          </button>
        </div>

        {/* 訊息區：顯示「請先選答案 / 請先提交 / 很可惜...」 */}
        {message && (
          <div style={{ ...ui.card, marginTop: 12, background: "#fff" }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>訊息</h3>
            <p style={{ margin: "8px 0 0", opacity: 0.8, lineHeight: 1.7 }}>
              {message}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}