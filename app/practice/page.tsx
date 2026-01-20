// app/practice/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ui } from "../ui";
import { clearSession, loadAllSessions, PracticeSession } from "../lib/session";

export default function PracticeHubPage() {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);

  function refresh() {
    setSessions(loadAllSessions());
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>學習區</h1>

      <div style={ui.card}>
        <p style={ui.cardDesc}>
          這裡只負責顯示「做到一半」的科目，讓你續做或清除。
          <br />
          開始新回合請回到各科入口（英文 / 數學）選擇階段後開始。
        </p>
      </div>

      <div style={{ height: 14 }} />

      {sessions.length === 0 ? (
        <div style={ui.card}>
          <h2 style={ui.cardTitle}>目前沒有未完成的練習</h2>
          <p style={ui.cardDesc}>去英文或數學入口開始後，這裡就會出現續做項目。</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {sessions.map((s) => (
            <div key={s.id} style={ui.card}>
              <h2 style={ui.cardTitle}>{s.subject}（未完成）</h2>
              <p style={ui.cardDesc}>
                進度：第 {s.currentIndex + 1} 題 / {s.totalQuestions}
                <br />
                對：{s.correctCount}　錯：{s.wrongCount}
                <br />
                提示：{s.hintUsed}/{s.hintLimit}
              </p>

              <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href="/practice/session" style={{ ...ui.navBtn, textDecoration: "none" }}>
                  續做
                </Link>

                <button
                  style={ui.navBtn}
                  onClick={() => {
                    clearSession(s.subject);
                    refresh();
                  }}
                >
                  清除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => history.back()}
        style={{ ...ui.backLink, marginTop: 18 }}
      >
        ← 回上一頁
      </button>
    </main>
  );
}