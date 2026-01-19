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
  hints: string[]; // 多段提示
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/** ✅ 測試題庫（示範用）：之後會換成你自建題庫系統 */
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

  // 若你未來要用 query 參數指定科目/回合，可以留著；目前不強制
  const subjectFromQuery = useMemo(() => searchParams.get("subject"), [searchParams]);

  const [session, setSession] = useState<PracticeSession | null>(null);

  // 回合統計（先存在本頁；你要「跨頁續做精準還原」下一步我會寫回 session）
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  // 題目互動狀態
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

    // 可選：如果網址帶 subject，就覆蓋當前 subject（你未來可以用學習區做到「不同回合」）
    if (subjectFromQuery && s.subject !== (subjectFromQuery as any)) {
      const next = { ...s, subject: subjectFromQuery as any };
      saveSession(next);
      setSession(next);
      return;
    }

    setSession(s);
  }, [router, subjectFromQuery]);

  // 計時（暫停就停；回合完成也停）
  useEffect(() => {
    if (!session || session.paused || roundDone) return;

    const timer = setInterval(() => {
      setSession((prev) => {
        if (!prev || prev.paused || roundDone) return prev;
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
  const shownNo = Math.min(currentNo, TOTAL_PER_ROUND);
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
    if (hasSubmitted) return; // ✅ 提交後不允許再改選，避免重複計分混亂
    setSelectedChoiceId(choiceId);
    setMessage(null);
  }

  function submit() {
    if (session.paused || roundDone) return;
    if (hasSubmitted) return; // ✅ 防止重複提交重複加分

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
      // ✅ 答對後提示卡可保留或清掉；你之前希望答對後自動消失，這裡先清掉提示
      setHintText(null);
    } else {
      setWrongCount((x) => x + 1);
      setMessage("很可惜，這題沒有答對。你可以再試一次或使用提示。");
      // ❗答錯仍保留提示（若已顯示）
    }
  }

  function useHint() {
    if (session.paused || roundDone) return;

    if (hintsLeft <= 0) {
      setHintText("提示已用完（本回合上限 5 次）。");
      return;
    }

    const idx = hintsUsed; // 0-based
    const text =
      currentQuestion.hints[idx] ??
      currentQuestion.hints[currentQuestion.hints.length - 1] ??
      "（暫無提示）";

    setHintsUsed((x) => x + 1);
    setHintText(text); // ✅ 覆蓋前一次提示內容（符合你要的）
  }

  function nextQuestion() {
    if (session.paused || roundDone) return;

    if (!selectedChoiceId) {
      setMessage("請先選擇一個答案。");
      return;
    }
    if (!hasSubmitted) {
      setMessage("請先提交答案。");
      return;
    }

    // ✅ 20 題結束：顯示回合完成畫面
    if (currentNo >= TOTAL_PER_ROUND) {
      setRoundDone(true);
      setMessage(null);
      return;
    }

    const next = { ...session, currentIndex: session.currentIndex + 1 };
    saveSession(next);
    setSession(next);

    // 清本題狀態
    setSelectedChoiceId(null);
    setHasSubmitted(false);
    setMessage(null);
    setHintText(null);
  }

  function finishRoundGoPractice() {
    // 先清掉「本回合」續做（你後面要留紀錄也可以改）
    clearSession();
    router.replace("/practice");
  }

  const pillStyle: React.CSSProperties = {
    ...ui.pill,
    whiteSpace: "nowrap",
  };

  // ✅ 回合完成畫面
  if (roundDone) {
    return (
      <main style={ui.wrap}>
        <h1 style={{ margin: "0 0 12px", fontSize: 28, fontWeight: 900 }}>回合完成 ✅</h1>

        <div style={ui.card}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>統計</h2>
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

      {/* 狀態卡 */}
      <div style={ui.card}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div style={pillStyle}>科目：{session.subject}</div>
          <div style={pillStyle}>
            第 {shownNo} / {TOTAL_PER_ROUND}
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

        {/* 暫停提醒卡 */}
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

          {/* ✅ 右側只放 對/錯/提示（你要求移除題目右上角提示欄） */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <div style={{ ...pillStyle, padding: "8px 12px" }}>對 {correctCount}</div>
            <div style={{ ...pillStyle, padding: "8px 12px" }}>錯 {wrongCount}</div>
            <div style={{ ...pillStyle, padding: "8px 12px" }}>
              提示 {HINT_LIMIT}/{hintsUsed}
            </div>
          </div>
        </div>

        <p style={{ margin: "10px 0 12px", lineHeight: 1.7 }}>{currentQuestion.prompt}</p>

        {/* 選項 */}
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

        {/* 提示內容（會覆蓋） */}
        {hintText && (
          <div style={{ ...ui.card, marginTop: 12, background: "#fff" }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>
              提示（{HINT_LIMIT}/{hintsUsed}）
            </h3>
            <p style={{ margin: "8px 0 0", opacity: 0.8, lineHeight: 1.7 }}>{hintText}</p>
          </div>
        )}

        {/* 訊息 */}
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