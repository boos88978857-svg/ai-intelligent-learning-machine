// app/practice/session/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../../ui";
import { loadSession, saveSession, PracticeSession } from "../../lib/session";

type QuestionType = "mcq" | "application";

type Question = {
  id: string;
  subject: PracticeSession["subject"];
  type: QuestionType;
  prompt: string;
  hint?: string;
  choices?: string[]; // mcq 用
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/** 假題庫（示範用） */
const demoBank: Question[] = [
  {
    id: "en-1",
    subject: "英文",
    type: "mcq",
    prompt: "（示範）Which one is a fruit?",
    hint: "想想常見水果",
    choices: ["Apple", "Chair", "Book", "Shoe"],
  },
  {
    id: "math-1",
    subject: "數學",
    type: "application",
    prompt: "（示範）小明有 12 顆糖，平均分給 3 個朋友，每人可以分到幾顆？",
    hint: "想想除法",
  },
];

export default function PracticeSessionPage() {
  const router = useRouter();

  const [session, setSession] = useState<PracticeSession | null>(null);

  // 作答 UI 狀態（不寫進 session）
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [toast, setToast] = useState<string>("");
  const [hintUsed, setHintUsed] = useState(0); // 0~3
  const [lockUI, setLockUI] = useState(false); // 提交後短暫鎖住，避免連點

  /** 依科目挑題：先用示範題，之後你會換成真題庫 */
  const question = useMemo(() => {
    if (!session) return null;
    // 先找同科目第一題示範（你之後會用 session.currentIndex 去拿題）
    const q = demoBank.find((x) => x.subject === session.subject) ?? demoBank[0];
    return q;
  }, [session]);

  // 載入續做資料
  useEffect(() => {
    const s = loadSession();
    if (!s) {
      router.replace("/practice");
      return;
    }
    setSession(s);
  }, [router]);

  // 每秒計時（進行中才跑）
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

  if (!session || !question) return null;

  function togglePause() {
    const next = { ...session, paused: !session.paused };
    saveSession(next);
    setSession(next);
  }

  function back() {
    router.back();
  }

  function showHint() {
    if (hintUsed >= 3) return;
    setHintUsed((n) => n + 1);
    setToast(question.hint ? `提示：${question.hint}` : "提示：這題先從題目關鍵字下手。");
    window.setTimeout(() => setToast(""), 1800);
  }

  /** 你之後會接真判題：目前用 demo 規則 */
  function isAnswerCorrect(): boolean {
    if (question.type === "mcq") {
      return selected === "Apple"; // demo：英文題正確是 Apple
    }
    if (question.type === "application") {
      // demo：先不做輸入題，直接讓它永遠正確（只是示範流程）
      return true;
    }
    return false;
  }

  function nextQuestionSoft() {
    // 下一題：先做「題號 +1」示範（你之後會換成真正的題庫索引）
    const next = { ...session, currentIndex: session.currentIndex + 1 };
    saveSession(next);
    setSession(next);

    // UI reset
    setSelected(null);
    setToast("");
    setHintUsed(0);
    setLockUI(false);
  }

  function submitAnswer() {
    if (lockUI) return;

    // mcq 沒選不給交
    if (question.type === "mcq" && !selected) {
      setToast("請先選一個答案。");
      window.setTimeout(() => setToast(""), 1400);
      return;
    }

    setLockUI(true);

    const ok = isAnswerCorrect();
    if (ok) {
      setCorrectCount((n) => n + 1);
      setToast("答對了！下一題準備中…");
      window.setTimeout(() => {
        setToast("");
        nextQuestionSoft();
      }, 600); // 不要太快
    } else {
      setWrongCount((n) => n + 1);
      setToast("很可惜，這題沒有答對。再試一次或使用提示。");
      window.setTimeout(() => {
        setToast("");
        setLockUI(false); // 錯了不跳題，解鎖讓他重新選
      }, 900);
    }
  }

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 30, fontWeight: 900 }}>
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

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          <span style={{ ...ui.navBtn, cursor: "default" }}>對：{correctCount}</span>
          <span style={{ ...ui.navBtn, cursor: "default" }}>錯：{wrongCount}</span>

          <button onClick={togglePause} style={{ ...ui.navBtn, cursor: "pointer" }}>
            {session.paused ? "▶ 繼續" : "⏸ 暫停"}
          </button>

          <button onClick={back} style={{ ...ui.navBtn, cursor: "pointer" }}>
            ← 回上一頁
          </button>
        </div>
      </div>

      {/* 題目卡 */}
      <div style={{ ...ui.card, marginTop: 14 }}>
        <h2 style={ui.cardTitle}>題目</h2>

        <p style={{ ...ui.cardDesc, marginTop: 10 }}>
          {question.prompt}
          <br />
          <span style={{ opacity: 0.75 }}>
            提示次數：{hintUsed}/3
          </span>
        </p>

        {/* 選擇題區 */}
        {question.type === "mcq" && question.choices && (
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            {question.choices.map((c) => {
              const active = selected === c;
              return (
                <button
                  key={c}
                  disabled={session.paused || lockUI}
                  onClick={() => setSelected(c)}
                  style={{
                    ...ui.card,
                    textAlign: "left",
                    cursor: session.paused || lockUI ? "not-allowed" : "pointer",
                    border: active ? "2px solid rgba(29,78,216,0.7)" : "1px solid rgba(0,0,0,0.15)",
                    background: active ? "rgba(29,78,216,0.06)" : "white",
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{c}</div>
                  {active && <div style={{ marginTop: 6, opacity: 0.7 }}>已選取</div>}
                </button>
              );
            })}
          </div>
        )}

        {/* 應用題示範區（先佔位，之後你會換成輸入框/草稿/工具） */}
        {question.type === "application" && (
          <div style={{ marginTop: 12 }}>
            <div style={{ ...ui.card, opacity: 0.9 }}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>作答區（示範佔位）</div>
              <div style={{ opacity: 0.75, lineHeight: 1.6 }}>
                之後你會在這裡放：
                <br />- 數字輸入 / 算式輸入
                <br />- 涂鴉白板
                <br />- 算盤工具
              </div>
            </div>
          </div>
        )}

        {/* 操作列：提示 / 提交 / 下一題 */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
          <button
            onClick={showHint}
            disabled={session.paused || hintUsed >= 3 || lockUI}
            style={{ ...ui.navBtn, cursor: session.paused || hintUsed >= 3 || lockUI ? "not-allowed" : "pointer" }}
          >
            💡 提示（{hintUsed}/3）
          </button>

          <button
            onClick={submitAnswer}
            disabled={session.paused || lockUI}
            style={{ ...ui.navBtn, cursor: session.paused || lockUI ? "not-allowed" : "pointer" }}
          >
            ✅ 提交答案
          </button>

          <button
            onClick={() => {
              setToast("已跳過（示範）。");
              window.setTimeout(() => setToast(""), 700);
              nextQuestionSoft();
            }}
            disabled={session.paused || lockUI}
            style={{ ...ui.navBtn, cursor: session.paused || lockUI ? "not-allowed" : "pointer" }}
          >
            下一題 →
          </button>
        </div>

        {/* 提示/回饋訊息 */}
        {toast && (
          <div style={{ marginTop: 12, ...ui.card, background: "rgba(0,0,0,0.03)" }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>訊息</div>
            <div style={{ opacity: 0.85, lineHeight: 1.6 }}>{toast}</div>
          </div>
        )}
      </div>
    </main>
  );
}