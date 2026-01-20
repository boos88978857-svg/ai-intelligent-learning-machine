// app/practice/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../ui";
import { loadAllSessions, removeSession, PracticeSession } from "../lib/session";

export default function PracticeHubPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<PracticeSession[]>([]);

  function refresh() {
    setSessions(loadAllSessions());
  }

  useEffect(() => {
    refresh();
  }, []);

  function goContinue(subject: PracticeSession["subject"]) {
    router.push(`/practice/session?subject=${encodeURIComponent(subject)}`);
  }

  function clearOne(subject: PracticeSession["subject"]) {
    removeSession(subject);
    refresh();
  }

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 1000 }}>
        學習區（續做中心）
      </h1>

      <div style={ui.card}>
        <p style={ui.cardDesc}>
          这里会显示你「做到一半」的科目。你可以继续作答，或清除进度。
        </p>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 14 }}>
        {sessions.length === 0 ? (
          <div style={ui.card}>
            <p style={ui.cardDesc}>目前沒有任何續做。</p>
          </div>
        ) : (
          sessions.map((s) => (
            <div key={s.id} style={ui.card}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div style={ui.pill}>科目：{s.subject}</div>
                <div style={ui.pill}>
                  第 {s.currentIndex + 1} 題 / {s.totalQuestions}
                </div>
                <div style={ui.pill}>
                  提示：{s.hintLimit}/{s.hintUsed}
                </div>
              </div>

              <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
                <button
                  style={ui.navBtn}
                  onClick={() => goContinue(s.subject)}
                >
                  继续作答 →
                </button>

                <button
                  style={ui.navBtn}
                  onClick={() => clearOne(s.subject)}
                >
                  清除进度
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: 18 }}>
        <span style={ui.backLink} onClick={() => router.back()}>
          ← 回上一頁
        </span>
      </div>
    </main>
  );
}