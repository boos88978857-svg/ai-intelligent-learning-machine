// app/practice/session/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../../ui";
import { loadSession, saveSession, PracticeSession } from "../../lib/session";
import { getMockQuestion, Question } from "../../lib/question";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

type AnswerState =
  | { kind: "none" }
  | { kind: "choice"; selectedId: string }
  | { kind: "fill"; text: string }
  | { kind: "application"; text: string };

export default function PracticeSessionPage() {
  const router = useRouter();
  const [session, setSession] = useState<PracticeSession | null>(null);

  // ✅ 作答狀態（本頁暫存，之後可寫進 session）
  const [answer, setAnswer] = useState<AnswerState>({ kind: "none" });

  // ✅ 顯示提示
  const [showHint, setShowHint] = useState(false);

  // ✅ 對/錯統計（先做在本頁，之後再寫進 session）
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // 載入續做資料
  useEffect(() => {
    const s = loadSession();
    if (!s) {
      router.replace("/practice");
      return;
    }
    setSession(s);
  }, [router]);

  // 計時（每秒 +1）
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

  const question: Question | null = useMemo(() => {
    if (!session) return null;
    return getMockQuestion(session.subject);
  }, [session]);

  // ✅ 每題切換：重置作答狀態/提示
  useEffect(() => {
    setAnswer({ kind: "none" });
    setShowHint(false);
  }, [question?.id]);

  if (!session) return null;

  function togglePause() {
    const next = { ...session, paused: !session.paused };
    saveSession(next);
    setSession(next);
  }

  function back() {
    router.back();
  }

  function nextQuestion() {
    // ✅ 先做 demo：只是把題號 +1（未來會真的換題）
    const next = { ...session, currentIndex: session.currentIndex + 1, paused: false };
    saveSession(next);
    setSession(next);
  }

  function endAndBackToHub() {
    // ✅ 結束回學習區（你要保留進度就不 clear，現在先保留）
    router.replace("/practice");
  }

  function canSubmit(q: Question, a: AnswerState) {
    if (q.type === "choice") return a.kind === "choice";
    if (q.type === "fill") return a.kind === "fill" && a.text.trim().length > 0;
    return a.kind === "application" && a.text.trim().length > 0;
  }

  function submit(q: Question) {
    if (!canSubmit(q, answer)) return;

    // ✅ 先做 demo 判題（之後會改成題庫評分）
    let isCorrect = false;

    if (q.type === "choice" && answer.kind === "choice") {
      isCorrect = answer.selectedId === q.answerId;
    } else if (q.type === "fill" && answer.kind === "fill") {
      isCorrect = answer.text.trim() === q.answerText.trim();
    } else if (q.type === "application" && answer.kind === "application") {
      // 應用題先不嚴格判斷：只要有填就算已提交（先走流程）
      isCorrect = true;
    }

    if (isCorrect) setCorrectCount((c) => c + 1);
    else setWrongCount((w) => w + 1);

    // ✅ 提交後自動下一題（你之後可以改成「顯示解析→下一題」）
    nextQuestion();
  }

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>
        作答中（{session.subject}）
      </h1>

      {/* A. 狀態區（固定） */}
      <section style={ui.card}>
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

        {/* ✅ 對/錯統計建議放在「狀態卡」底部，一眼看得到 */}
        <div style={{ marginTop: 10, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <span style={{ ...ui.navBtn, opacity: 0.9 }}>對：{correctCount}</span>
          <span style={{ ...ui.navBtn, opacity: 0.9 }}>錯：{wrongCount}</span>
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={togglePause} style={{ ...ui.navBtn, cursor: "pointer" }}>
            {session.paused ? "▶ 繼續" : "⏸ 暫停"}
          </button>

          <button onClick={back} style={{ ...ui.navBtn, cursor: "pointer" }}>
            ← 回上一頁
          </button>
        </div>
      </section>

      {/* B. 題目區（依題型變化） */}
      <section style={{ ...ui.card, marginTop: 16 }}>
        <h2 style={ui.cardTitle}>題目</h2>

        {!question ? (
          <p style={ui.cardDesc}>題目載入中…</p>
        ) : (
          <>
            <p style={{ ...ui.cardDesc, marginTop: 10 }}>
              {question.prompt}
              <br />
              <span style={{ opacity: 0.7 }}>
                工具：
                {question.tools?.whiteboard ? " 白板開" : " 白板關"} /
                {question.tools?.abacus ? " 算盤開" : " 算盤關"}
              </span>
            </p>

            {/* ✅ 提示：放在題目區「題幹下方」，不占狀態卡空間 */}
            <div style={{ marginTop: 10, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => setShowHint((v) => !v)}
                style={{ ...ui.navBtn, cursor: "pointer" }}
              >
                {showHint ? "隱藏提示" : "顯示提示"}
              </button>
            </div>

            {showHint && question.hint ? (
              <div style={{ marginTop: 10, ...ui.navBtn, opacity: 0.9 }}>
                提示：{question.hint}
              </div>
            ) : null}

            {/* ✅ 作答區：依題型渲染 */}
            <div style={{ marginTop: 14 }}>
              <AnswerArea question={question} answer={answer} setAnswer={setAnswer} paused={!!session.paused} />
            </div>

            {/* ✅ 操作列：建議放在作答區下方（拇指區） */}
            <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => submit(question)}
                disabled={!canSubmit(question, answer) || !!session.paused}
                style={{
                  ...ui.navBtn,
                  cursor: !canSubmit(question, answer) || !!session.paused ? "not-allowed" : "pointer",
                  opacity: !canSubmit(question, answer) || !!session.paused ? 0.5 : 1,
                }}
              >
                提交答案
              </button>

              <button
                onClick={nextQuestion}
                disabled={!!session.paused}
                style={{
                  ...ui.navBtn,
                  cursor: !!session.paused ? "not-allowed" : "pointer",
                  opacity: !!session.paused ? 0.5 : 1,
                }}
              >
                下一題 →
              </button>

              <button
                onClick={endAndBackToHub}
                style={{ ...ui.navBtn, cursor: "pointer" }}
              >
                結束並回學習區
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function AnswerArea(props: {
  question: Question;
  answer: AnswerState;
  setAnswer: (a: AnswerState) => void;
  paused: boolean;
}) {
  const { question: q, answer, setAnswer, paused } = props;

  // ✅ 共用：暫停時不可操作
  const disabledStyle = paused ? { opacity: 0.6, pointerEvents: "none" as const } : undefined;

  if (q.type === "choice") {
    const selectedId = answer.kind === "choice" ? answer.selectedId : "";

    return (
      <div style={{ display: "grid", gap: 10, ...(disabledStyle || {}) }}>
        {q.options.map((op) => {
          const selected = selectedId === op.id;
          return (
            <button
              key={op.id}
              onClick={() => setAnswer({ kind: "choice", selectedId: op.id })}
              style={{
                ...ui.navBtn,
                cursor: "pointer",
                textAlign: "left",
                fontWeight: selected ? 900 : 600,
                borderColor: selected ? "rgba(29,78,216,0.6)" : "rgba(0,0,0,0.15)",
              }}
            >
              {op.text}
              {selected ? " ✓" : ""}
            </button>
          );
        })}
      </div>
    );
  }

  if (q.type === "fill") {
    const text = answer.kind === "fill" ? answer.text : "";

    return (
      <div style={{ ...(disabledStyle || {}) }}>
        <div style={{ ...ui.navBtn, padding: 12 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>請輸入答案</div>
          <input
            value={text}
            onChange={(e) => setAnswer({ kind: "fill", text: e.target.value })}
            placeholder="在這裡輸入…"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.15)",
              fontSize: 16,
            }}
          />
        </div>
      </div>
    );
  }

  // application
  const text = answer.kind === "application" ? answer.text : "";

  return (
    <div style={{ ...(disabledStyle || {}) }}>
      <div style={{ ...ui.navBtn, padding: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>請寫下你的解題過程/答案</div>
        <textarea
          value={text}
          onChange={(e) => setAnswer({ kind: "application", text: e.target.value })}
          placeholder="例如：12 ÷ 3 = 4…"
          rows={4}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.15)",
            fontSize: 16,
            lineHeight: 1.6,
            resize: "vertical",
          }}
        />
      </div>

      {/* 先預留：白板/算盤入口（下一步才真的做） */}
      <div style={{ marginTop: 10, display: "flex", gap: 12, flexWrap: "wrap", opacity: 0.85 }}>
        {q.tools?.whiteboard ? <span style={ui.navBtn}>白板（下一步接）</span> : null}
        {q.tools?.abacus ? <span style={ui.navBtn}>算盤（下一步接）</span> : null}
      </div>
    </div>
  );
}