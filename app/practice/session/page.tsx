// app/practice/session/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../../ui";
import { loadSession, saveSession, PracticeSession, clearSession } from "../../lib/session";

type QuestionType = "mcq";

type Question = {
  id: string;
  subject: PracticeSession["subject"];
  type: QuestionType;
  prompt: string;
  choices: { id: string; text: string; correct?: boolean }[];
  hint: string[]; // 多段提示
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/** 測試題庫：現在只是示範，所以同一題會固定同一組提示 */
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

const TOTAL_PER_ROUND = 20;
const HINT_LIMIT = 5;

export default function PracticeSessionPage() {
  const router = useRouter();

  const [session, setSession] = useState<PracticeSession | null>(null);

  // 回合狀態（先存在本頁 state；你要「斷網續做」我們下一步再寫入 session/localStorage）
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hintText, setHintText] = useState<string | null>(null);

  const [roundDone, setRoundDone] = useState(false);

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
    if (!session || session.paused || roundDone) return;

    const timer = setInterval(() => {
      setSession((prev) => {
        if (!prev) return prev;
        const next = { ...prev, elapsedSec: prev.elapsedSec + 1 };
        saveSession(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session, roundDone]);

  const currentQuestion = useMemo(() => {
    if (!session) return null;
    const pool = mockQuestions.filter((q) => q.subject === session.subject);
    const list = pool.length ? pool : mockQuestions;
    const idx = session.currentIndex % list.length;
    return list[idx];
  }, [session]);

  if (!session || !currentQuestion) return null;

  const currentNo = session.currentIndex + 1;
  const progressText = `${Math.min(currentNo, TOTAL_PER_ROUND)} / ${TOTAL_PER_ROUND}`;
  const hintsLeft = Math.max(0, HINT_LIMIT - hintsUsed);

  function togglePause() {
    const next = { ...session, paused: !session.paused };
    saveSession(next);
    setSession(next);

    if (next.paused) {
      setMessage("已暫停。請點上方「▶ 繼續」後再操作。");
    } else {
      setMessage(null);
    }
  }

  function back() {
    router.back();
  }

  function selectChoice(choiceId: string) {
    if (session.paused || roundDone) return;
    setSelectedChoiceId(choiceId);
    setMessage(null);
    setHasSubmitted(false);
  }

  function submit() {
    if (session.paused || roundDone) return;
if (hasSubmitted) return;

    if (!selectedChoiceId) {
      setMessage("請先選擇一個答案。");
      return;
    }

    const picked = currentQuestion.choices.find((c) => c.id === selectedChoiceId);
    const isCorrect = !!picked?.correct;

    setHasSubmitted(true);

    if (isCorrect) {
      setCorrectCount((x) => x + 1);
      setMessage("答對了！請繼續下一題。");
    } else {
      setWrongCount((x) => x + 1);
      setMessage("很可惜，這題沒有答對。你可以再試一次或使用提示。");
    }
  }

  function useHint() {
    if (session.paused || roundDone) return;

    if (hintsLeft <= 0) {
      setHintText("提示已用完（本回合上限 5 次）。");
      return;
    }

    // 第幾次提示（0-based）
    const idx = hintsUsed;
    const text = currentQuestion.hint[idx] ?? currentQuestion.hint[currentQuestion.hint.length - 1] ?? "（暫無提示）";

    setHintsUsed((x) => x + 1);
    setHintText(text); // ✅ 會覆蓋前一次提示（符合你說的「再按一次覆蓋」）
  }

  function nextQuestion() {
    if (session.paused || roundDone) return;

    // 擋住沒作答就下一題
    if (!selectedChoiceId) {
      setMessage("請先選擇一個答案。");
      return;
    }
    if (!hasSubmitted) {
      setMessage("請先提交答案。");
      return;
    }

    // ✅ 20 題結束：進回合完成畫面
    if (currentNo >= TOTAL_PER_ROUND) {
      setRoundDone(true);
      setMessage(null);
      return;
    }

    const next = { ...session, currentIndex: session.currentIndex + 1 };
    saveSession(next);
    setSession(next);

    // 清掉本題狀態
    setSelectedChoiceId(null);
    setHasSubmitted(false);
    setMessage(null);
    setHintText(null);
  }

  function finishRoundGoPractice() {
    // 結束回合：清掉續做（你可改成保留紀錄，下一步做「記錄頁」）
    clearSession();
    router.replace("/practice");
  }

  // 狀態小方塊（固定同一行，避免換行變醜）
  const statPill: React.CSSProperties = {
    ...ui.navBtn,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    whiteSpace: "nowrap",
    minHeight: 44,
  };

  // ✅ 回合完成畫面
  if (roundDone) {
    return (
      <main style={ui.wrap}>
        <h1 style={{ margin: "0 0 12px", fontSize: 28, fontWeight: 900 }}>回合完成 ✅</h1>

        <div style={ui.card}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>統計</h2>
          <p style={{ margin: "10px 0 0", opacity: 0.8, lineHeight: 1.7 }}>
            科目：{session.subject}
            <br />
            題數：{TOTAL_PER_ROUND}
            <br />
            對：{correctCount}　錯：{wrongCount}
            <br />
            提示：{HINT_LIMIT}/{hintsUsed}
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

      {/* 狀態卡：固定同一行，不掉字 */}
      <div style={ui.card}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
          }}
        >
          <div style={statPill}>科目：{session.subject}</div>
          <div style={statPill}>第 {progressText}</div>
          <div style={statPill}>⏱ {formatTime(session.elapsedSec)}</div>
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={togglePause} style={{ ...ui.navBtn, cursor: "pointer" }}>
            {session.paused ? "▶ 繼續" : "⏸ 暫停"}
          </button>
          <button onClick={back} style={{ ...ui.navBtn, cursor: "pointer" }}>
            ← 回上一頁
          </button>
        </div>

        {/* 暫停提醒卡：只在暫停時顯示 */}
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
        {/* ✅ 你要的：題目左邊，右邊放 對/錯/提示 */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>題目</h2>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <div style={{ ...statPill, minHeight: 40 }}>對 {correctCount}</div>
            <div style={{ ...statPill, minHeight: 40 }}>錯 {wrongCount}</div>
            <div style={{ ...statPill, minHeight: 40 }}>提示：{HINT_LIMIT}/{hintsUsed}</div>
          </div>
        </div>

        <p style={{ margin: "10px 0 12px", lineHeight: 1.7 }}>{currentQuestion.prompt}</p>

        {/* 選項：只變色，不顯示已選取文字 */}
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
              </button>
            );
          })}
        </div>

        {/* 操作列 */}
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
            💡 提示（{HINT_LIMIT}/{hintsUsed}）
          </button>

        <button
  onClick={submit}
  disabled={session.paused || hasSubmitted}   // ✅ 提交後不能再按
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
  disabled={session.paused || !hasSubmitted}   // ✅ 沒提交不能按
  style={{
    ...ui.navBtn,
    cursor: session.paused || !hasSubmitted ? "not-allowed" : "pointer",
    opacity: session.paused || !hasSubmitted ? 0.6 : 1,
  }}
>
  下一題 →
</button>
        </div>

        {/* ✅ 提示顯示：點一次顯示、再點覆蓋、答對/下一題時清掉（下一題已清掉） */}
        {hintText && (
          <div style={{ ...ui.card, marginTop: 12, background: "#fff" }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>
              提示（{HINT_LIMIT}/{hintsUsed}）
            </h3>
            <p style={{ margin: "8px 0 0", opacity: 0.8, lineHeight: 1.7 }}>{hintText}</p>
          </div>
        )}

        {/* 訊息：答對/答錯/防呆 */}
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