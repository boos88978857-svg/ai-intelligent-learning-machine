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
  hints?: string[];
  choices?: string[];
};

const ROUND_QUESTIONS = 20; // 一回合 20 題
const MAX_HINTS = 5;        // 一回合 5 次提示

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
    hints: ["想想常見水果", "水果通常可以吃", "Apple 是水果，其他是物品", "用排除法", "Apple 最符合"],
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

  // 顯示用統計（demo）
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // 作答狀態
  const [selected, setSelected] = useState<string | null>(null);

  // ✅ 是否已提交過本題（沒提交就不能下一題）
  const [submitted, setSubmitted] = useState(false);

  // 提示
  const [hintUsed, setHintUsed] = useState(0);
  const [hintText, setHintText] = useState("");

  // 訊息（答錯/答對/提醒）
  const [toast, setToast] = useState("");

  // 暫停提示彈窗（點畫面提示）
  const [pauseTip, setPauseTip] = useState("");

  // 鎖 UI（提交後避免連點）
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

  function hintCounterLabel() {
    return `${MAX_HINTS}/${Math.min(hintUsed, MAX_HINTS)}`;
  }

  function togglePause() {
    const next = { ...session, paused: !session.paused };
    saveSession(next);
    setSession(next);

    // 清掉暫停提示
    setPauseTip("");
  }

  function back() {
    router.back();
  }

  // ✅ 暫停時，點畫面任一處 → 提示「請按 ▶ 繼續」
  function handlePausedClick() {
    if (!session.paused) return;
    if (pauseTip) return; // 已顯示就別狂刷
    setPauseTip("已暫停。請點上方「▶ 繼續」後再操作。");
  }

  // 點一次提示 → 顯示下一條（覆蓋上一條），不自動消失
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
    const nextText = hints[nextUsed - 1] ?? hints[hints.length - 1];

    setHintUsed(nextUsed);
    setHintText(nextText);

    setToast(`已顯示提示（${MAX_HINTS}/${nextUsed}）`);
    window.setTimeout(() => setToast(""), 800);
  }

  // demo 判題
  function isAnswerCorrect(): boolean {
    if (question.type === "mcq") return selected === "Apple";
    if (question.type === "application") return true;
    return false;
  }

  // ✅ 進下一題（只會在「答對」時觸發）
  function goNextQuestion() {
    const next = { ...session, currentIndex: session.currentIndex + 1 };
    saveSession(next);
    setSession(next);

    // 清 UI
    setSelected(null);
    setSubmitted(false);
    setToast("");
    setHintText("");
    setLockUI(false);
    setPauseTip("");
  }

  function submitAnswer() {
    if (lockUI) return;

    // 暫停時不能提交
    if (session.paused) return;

    // MCQ 必須先選
    if (question.type === "mcq" && !selected) {
      setToast("請先選一個答案。");
      window.setTimeout(() => setToast(""), 1200);
      return;
    }

    setLockUI(true);
    setSubmitted(true);

    const ok = isAnswerCorrect();
    if (ok) {
      setCorrectCount((n) => n + 1);
      setToast("答對了！下一題準備中…");

      window.setTimeout(() => {
        // 答對 → 進下一題，並清掉提示
        setHintText("");
        goNextQuestion();
      }, 850);
    } else {
      setWrongCount((n) => n + 1);

      // ✅ 文案：不要「你選錯了」
      setToast("很可惜，這題沒有答對。你可以再試一次或使用提示。");

      // 顯示久一點
      window.setTimeout(() => {
        setToast("");
        setLockUI(false);
        setSubmitted(false); // 答錯不算提交成功，仍需重提
      }, 2600);
    }
  }

  // 讓手機更容易一頁顯示：縮小 padding
  const compactWrap = {
    ...ui.wrap,
    paddingTop: 10,
    paddingBottom: 10,
  } as React.CSSProperties;

  const compactCard = {
    ...ui.card,
    padding: 14,
  } as React.CSSProperties;

  const uiDisabled = session.paused || lockUI;

  return (
    <main style={compactWrap} onClick={handlePausedClick}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.2 }}>
          作答中
        </div>
      </div>

      {/* 狀態列（不顯示提示 5/0、不顯示對錯） */}
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

        {/* ✅ 暫停提示（點畫面才出現） */}
        {pauseTip && (
          <div style={{ marginTop: 10, ...compactCard, background: "rgba(0,0,0,0.03)", padding: 12 }}>
            <div style={{ fontWeight: 900, marginBottom: 4 }}>提醒</div>
            <div style={{ opacity: 0.85, lineHeight: 1.6 }}>{pauseTip}</div>
          </div>
        )}
      </section>

      {/* 題目卡 */}
      <section style={{ ...compactCard, marginTop: 10 }}>
        {/* 右上角：對/錯/提示 */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
          <h2 style={{ ...ui.cardTitle, margin: 0 }}>題目</h2>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <span style={{ ...ui.navBtn, cursor: "default" }}>對 {correctCount}</span>
            <span style={{ ...ui.navBtn, cursor: "default" }}>錯 {wrongCount}</span>
            <span style={{ ...ui.navBtn, cursor: "default" }}>提示：{hintCounterLabel()}</span>
          </div>
        </div>

        <p style={{ ...ui.cardDesc, marginTop: 10 }}>{question.prompt}</p>

        {/* 提示視窗：顯示後保留，直到答對下一題才清掉 */}
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
                  disabled={uiDisabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(c);
                  }}
                  style={{
                    ...compactCard,
                    textAlign: "left",
                    cursor: uiDisabled ? "not-allowed" : "pointer",
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
            onClick={(e) => {
              e.stopPropagation();
              showHint();
            }}
            disabled={uiDisabled || hintUsed >= MAX_HINTS}
            style={{
              ...ui.navBtn,
              cursor: uiDisabled || hintUsed >= MAX_HINTS ? "not-allowed" : "pointer",
            }}
          >
            💡 提示（{hintCounterLabel()}）
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              submitAnswer();
            }}
            disabled={uiDisabled}
            style={{ ...ui.navBtn, cursor: uiDisabled ? "not-allowed" : "pointer" }}
          >
            ✅ 提交答案
          </button>

          {/* ✅ 下一題：永遠鎖住（避免沒答就亂加），答對會自動跳 */}
          <button
            onClick={(e) => e.stopPropagation()}
            disabled={true}
            style={{ ...ui.navBtn, cursor: "not-allowed", opacity: 0.5 }}
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