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

export default function PracticeSessionPage() {
  const router = useRouter();
  const [session, setSession] = useState<PracticeSession | null>(null);

  // 載入續做資料
  useEffect(() => {
    const s = loadSession();
    if (!s) {
      router.replace("/practice");
      return;
    }
    setSession(s);
  }, [router]);

  // 簡單計時（每秒 +1）
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

  if (!session) return null;

  function togglePause() {
    const next = { ...session, paused: !session.paused };
    saveSession(next);
    setSession(next);
  }

  function back() {
    router.back();
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
          <QuestionPreview question={question} />
        )}
      </section>
    </main>
  );
}

/** 先做「題目渲染骨架」：目前只預覽，不做判題 */
function QuestionPreview(props: { question: Question }) {
  const q = props.question;

  return (
    <div>
      <p style={{ ...ui.cardDesc, marginTop: 10 }}>
        {q.prompt}
        {q.hint ? (
          <>
            <br />
            <span style={{ opacity: 0.7 }}>提示：{q.hint}</span>
          </>
        ) : null}
        <br />
        <span style={{ opacity: 0.7 }}>
          工具：
          {q.tools?.whiteboard ? " 白板開" : " 白板關"} /
          {q.tools?.abacus ? " 算盤開" : " 算盤關"}
        </span>
      </p>

      {/* 題型預覽（下一步才換成真正作答元件） */}
      <div style={{ marginTop: 12 }}>
        {q.type === "choice" ? (
          <div style={{ display: "grid", gap: 10 }}>
            {q.options.map((op) => (
              <div key={op.id} style={{ ...ui.navBtn, opacity: 0.9 }}>
                {op.text}
              </div>
            ))}
          </div>
        ) : q.type === "fill" ? (
          <div style={{ ...ui.navBtn, opacity: 0.9 }}>
            （填空題示意）這裡之後放輸入框
          </div>
        ) : (
          <div style={{ ...ui.navBtn, opacity: 0.9 }}>
            （應用題示意）這裡之後放作答區 + 可能的白板/算盤
          </div>
        )}
      </div>

      <div style={{ marginTop: 14, opacity: 0.6 }}>
        ※ 下一步才加入：提示按鈕、對/錯統計、提交答案、下一題、結束等操作列
      </div>
    </div>
  );
}