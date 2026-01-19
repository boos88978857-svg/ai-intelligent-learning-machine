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
  hints?: string[]; // 最多 3 條提示
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
    hints: ["想想常見水果", "水果通常可以吃", "Apple 是水果，其他是物品"],
    choices: ["Apple", "Chair", "Book", "Shoe"],
  },
  {
    id: "math-1",
    subject: "數學",
    type: "application",
    prompt: "（示範）小明有 12 顆糖，平均分給 3 個朋友，每人可以分到幾顆？",
    hints: ["想想除法", "12 ÷ 3", "每人分到 4 顆"],
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
  const [hintUsed, setHintUsed] = useState(0); // 0~3
  const [hintText, setHintText] = useState<string>("");

  // 短訊息（例如：未選答案、答錯提醒等）
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

  // ✅ 顯示格式：3/1、3/2、3/3
  function hintCounterLabel() {
    return `3/${Math.min(hintUsed, 3)}`;
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
    if (hintUsed >= 3) return;

    const hints =
      question.hints ?? ["提示：先抓題目關鍵字。", "提示：拆成兩步想。", "提示：先用最簡單方法試算。"];

    const nextUsed = hintUsed + 1;
    const nextText = hints[nextUsed - 1] ?? hints[hints.length - 1];

    setHintUsed(nextUsed);
    setHintText(nextText);

    // toast 只是輕提示（不影響提示視窗）
    setToast(`已顯示提示（3/${nextUsed}）`);
    window.setTimeout(() => setToast(""), 700);
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
    setHintUsed(0);
    setHintText("");
    setLockUI(false);
  }

  function submitAnswer() {
    if (lockUI) return;

    if (question.type === "mcq" && !selected) {
      setToast("請先選一個答案。");
      window.setTimeout(() => setToast(""), 1100);
      return;
    }

    setLockUI(true);

    const ok = isAnswerCorrect();
    if (ok) {
      setCorrectCount((n) => n + 1);
      setToast("答對了！下一題準備中…");
      window.setTimeout(() => {
        nextQuestionSoft(); // ✅ 答對跳題後提示自動消失
      }, 650);
    } else {
      setWrongCount((n) => n + 1);
      setToast("很可惜，這題沒有答對。你可以再試一次或使用提示。");
      window.setTimeout(() => {
        setToast("");
        setLockUI(false);
      }, 900);
    }
  }

  // ✅ 讓手機一頁內更容易看到：縮小間距與卡片 padding
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
      {/* ✅ 標題縮小、佔位更少 */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.2 }}>作答中</div>
      </div>

      {/* ✅ 狀態列：改成「一排資訊 + 一排按鈕」，題目區就能更往上 */}
      <section style={compactCard}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ ...ui.navBtn, cursor: "default" }}>科目：{session.subject}</span>
          <span style={{ ...ui.navBtn, cursor: "default" }}>第 {session.currentIndex + 1} 題</span>
          <span style={{ ...ui.navBtn, cursor: "default" }}>⏱ {formatTime(session.elapsedSec)}</span>
          <span style={{ ...ui.navBtn, cursor: "default" }}>對 {correctCount}</span>
          <span style={{ ...ui.navBtn, cursor: "default" }}>錯 {wrongCount}</span>
          <span style={{ ...ui.navBtn, cursor: "default" }}>提示 {hintCounterLabel()}</span>
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

      {/* ✅ 題目卡：往上提、間距縮小 */}
      <section style={{ ...compactCard, marginTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
          <h2 style={{ ...ui.cardTitle, margin: 0 }}>題目</h2>
          <span style={{ opacity: 0.75, fontWeight: 700 }}>提示：{hintCounterLabel()}</span>
        </div>

        <p style={{ ...ui.cardDesc, marginTop: 10 }}>{question.prompt}</p>

        {/* ✅ 提示視窗：一旦顯示就留著，覆蓋更新，不自動收 */}
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
              // ✅ 自動變欄數：手機直向大多 2 欄，減少高度、避免滑動
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

        {/* ✅ 操作列：放在題目卡底部，手機一頁內可按到 */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          <button
            onClick={showHint}
            disabled={session.paused || hintUsed >= 3 || lockUI}
            style={{
              ...ui.navBtn,
              cursor: session.paused || hintUsed >= 3 || lockUI ? "not-allowed" : "pointer",
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
              window.setTimeout(() => setToast(""), 700);
              nextQuestionSoft();
            }}
            disabled={session.paused || lockUI}
            style={{ ...ui.navBtn, cursor: session.paused || lockUI ? "not-allowed" : "pointer" }}
          >
            下一題 →
          </button>
        </div>

        {/* ✅ 短訊息 */}
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