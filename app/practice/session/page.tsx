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
  hints?: string[]; // 最多 5 條提示（用不到也沒關係）
  choices?: string[]; // mcq 用
};

const ROUND_QUESTIONS = 20; // ✅ 一回合 20 題
const MAX_HINTS = 5;        // ✅ 一回合 5 次提示

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
    hints: ["想想常見水果", "水果通常可以吃", "Apple 是水果，其他是物品", "再想想「食物」類", "Apple 最符合"],
    choices: ["Apple", "Chair", "Book", "Shoe"],
  },
  {
    id: "math-1",
    subject: "數學",
    type: "application",
    prompt: "（示範）小明有 12 顆糖，平均分給 3 個朋友，每人可以分到幾顆？",
    hints: ["想想除法", "12 ÷ 3", "每人分到 4 顆", "把 12 平均切 3 份", "答案是 4"],
  },
];

export default function PracticeSessionPage() {
  const router = useRouter();

  const [session, setSession] = useState<PracticeSession | null>(null);

  // 作答 UI 狀態（暫不寫進 session）
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  // ✅ 提示：不自動消失，直到答對進下一題才清掉
  const [hintUsed, setHintUsed] = useState(0); // 0~MAX_HINTS
  const [hintText, setHintText] = useState<string>("");

  // 訊息（答錯/提醒等）
  const [toast, setToast] = useState<string>("");

  const [lockUI, setLockUI] = useState(false);

  const question = useMemo(() => {
    if (!session) return null;
    return demoBank.find((x) => x.subject === session.subject) ?? demoBank[0];
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

  // 計時（進行中才跑）
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

  // ✅ 顯示格式：5/0、5/1、5/2…
  function hintCounterLabel() {
    return `${MAX_HINTS}/${Math.min(hintUsed, MAX_HINTS)}`;
  }

  function togglePause() {
    const next = { ...session, paused: !session.paused };
    saveSession(next);
    setSession(next);
  }

  function back() {
    router.back();
  }

  // ✅ 點一次提示 → 顯示下一條（覆蓋上一條），不自動消失
  function showHint() {
    if (hintUsed >= MAX_HINTS) return;

    const hints =
      question.hints ?? [
        "提示：先抓題目關鍵字。",
        "提示：拆成兩步想。",
        "提示：先用最簡單方法試算。",
        "提示：回頭檢查題意。",
        "提示：用排除法。",
      ];

    const nextUsed = hintUsed + 1;

    // 若題庫提示不足 5 條，就用最後一條補齊
    const nextText = hints[nextUsed - 1] ?? hints[hints.length - 1];

    setHintUsed(nextUsed);
    setHintText(nextText);

    // 小提示（不影響提示視窗）
    setToast(`已顯示提示（${MAX_HINTS}/${nextUsed}）`);
    window.setTimeout(() => setToast(""), 800);
  }

  /** demo 判題 */
  function isAnswerCorrect(): boolean {
    if (question.type === "mcq") return selected === "Apple";
    if (question.type === "application") return true;
    return false;
  }

  // ✅ 下一題：清掉提示視窗/選擇/訊息
  function nextQuestionSoft() {
    const next = { ...session, currentIndex: session.currentIndex + 1 };
    saveSession(next);
    setSession(next);

    setSelected(null);
    setToast("");
    setHintText("");
    setLockUI(false);
  }

  function submitAnswer() {
    if (lockUI) return;

    if (question.type === "mcq" && !selected) {
      setToast("請先選一個答案。");
      window.setTimeout(() => setToast(""), 1200);
      return;
    }

    setLockUI(true);

    const ok = isAnswerCorrect();
    if (ok) {
      setCorrectCount((n) => n + 1);
      setToast("答對了！下一題準備中…");

      // ✅ 答對跳題速度不要太快（稍微慢一點）
      window.setTimeout(() => {
        // 答對進下一題時，提示自動消失（符合你需求）
        setHintText("");
        nextQuestionSoft();
      }, 850);
    } else {
      setWrongCount((n) => n + 1);

      // ✅ 文案：不要「你選錯了」，改成「很可惜…」
      setToast("很可惜，這題沒有答對。你可以再試一次或使用提示。");

      // ✅ 顯示久一點
      window.setTimeout(() => {
        setToast("");
        setLockUI(false);
      }, 2600);
    }
  }

  // ✅ 讓手機更容易一頁顯示：縮小 padding
  const compactWrap = {
    ...ui.wrap,
    paddingTop: 10,
    paddingBottom: 10,
  } as React.CSSProperties;

  const compactCard = {
    ...ui.card,
    padding: 14,
  } as React.CSSProperties;

  return (
    <main style={compactWrap}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.2 }}>作答中</div>
      </div>

      {/* ✅ 狀態列：移除「提示 5/0」與 對/錯（避免上面重複） */}
      <section style={compactCard}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ ...ui.navBtn, cursor: "default" }}>科目：{session.subject}</span>
          <span style={{ ...ui.navBtn, cursor: "default" }}>
            第 {session.currentIndex + 1} 題 / {ROUND_QUESTIONS}
          </span>
          <span style={{ ...ui.navBtn, cursor: "default" }}>⏱ {formatTime(session.elapsedSec)}</span>
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={togglePause} style={{ ...ui.navBtn, cursor: "pointer" }}>
            {session.paused ? "▶ 繼續" : "⏸ 暫停"}
          </button>

          <button onClick={back} style={{ ...ui.navBtn, cursor: "pointer" }}>
            ← 回上一頁
          </button>
        </div>
      </section>

      {/* 題目卡 */}
      <section style={{ ...compactCard, marginTop: 10 }}>
        {/* ✅ 右上角：放「對/錯/提示」(把你說多餘的區塊用起來) */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
          <h2 style={{ ...ui.cardTitle, margin: 0 }}>題目</h2>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <span style={{ ...ui.navBtn, cursor: "default" }}>對 {correctCount}</span>
            <span style={{ ...ui.navBtn, cursor: "default" }}>錯 {wrongCount}</span>
            <span style={{ ...ui.navBtn, cursor: "default" }}>提示：{hintCounterLabel()}</span>
          </div>
        </div>

        <p style={{ ...ui.cardDesc, marginTop: 10 }}>{question.prompt}</p>

        {/* 提示視窗：顯示後保留，直到答對跳題才清掉 */}
        {hintText && (
          <div style={{ marginTop: 10, ...compactCard, background: "rgba(29,78,216,0.06)" }}>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>提示（{hintCounterLabel()}）</div>
            <div style={{ lineHeight: 1.7, opacity: 0.9 }}>{hintText}</div>
          </div>
        )}

        {/* 作答區 */}
        {question.type === "mcq" && question.choices && (
          <div
            style={{
              display: "grid",
              gap: 10,
              marginTop: 10,
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            }}
          >
            {question.choices.map((c) => {
              const active = selected === c;
              return (
                <button
                  key={c}
                  disabled={session.paused || lockUI}
                  onClick={() => setSelected(c)}
                  style={{
                    ...compactCard,
                    textAlign: "left",
                    cursor: session.paused || lockUI ? "not-allowed" : "pointer",
                    border: active ? "2px solid rgba(29,78,216,0.7)" : "1px solid rgba(0,0,0,0.15)",
                    background: active ? "rgba(29,78,216,0.06)" : "white",
                    padding: 12,
                  }}
                >
                  <div style={{ fontSize: 17, fontWeight: 900 }}>{c}</div>
                  {active && <div style={{ marginTop: 4, opacity: 0.7 }}>已選取</div>}
                </button>
              );
            })}
          </div>
        )}

        {question.type === "application" && (
          <div style={{ marginTop: 10 }}>
            <div style={{ ...compactCard, opacity: 0.92, padding: 12 }}>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>作答區（示範佔位）</div>
              <div style={{ opacity: 0.75, lineHeight: 1.6 }}>
                之後會在此放：輸入答案 / 解題過程 + 白板/算盤工具（抽屜式）
              </div>
            </div>
          </div>
        )}

        {/* 操作列 */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          <button
            onClick={showHint}
            disabled={session.paused || hintUsed >= MAX_HINTS || lockUI}
            style={{
              ...ui.navBtn,
              cursor: session.paused || hintUsed >= MAX_HINTS || lockUI ? "not-allowed" : "pointer",
            }}
          >
            💡 提示（{hintCounterLabel()}）
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
              window.setTimeout(() => setToast(""), 900);
              setHintText("");
              nextQuestionSoft();
            }}
            disabled={session.paused || lockUI}
            style={{ ...ui.navBtn, cursor: session.paused || lockUI ? "not-allowed" : "pointer" }}
          >
            下一題 →
          </button>
        </div>

        {/* 訊息 */}
        {toast && (
          <div style={{ marginTop: 10, ...compactCard, background: "rgba(0,0,0,0.03)", padding: 12 }}>
            <div style={{ fontWeight: 900, marginBottom: 4 }}>訊息</div>
            <div style={{ opacity: 0.85, lineHeight: 1.6 }}>{toast}</div>
          </div>
        )}
      </section>
    </main>
  );
}