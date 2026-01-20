// app/practice/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../ui";
import { PracticeSession, listInProgressSessions, removeSession, clearAllSessions } from "../lib/session";

export default function PracticeHubPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<PracticeSession[]>([]);

  function refresh() {
    setSessions(listInProgressSessions());
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 40, fontWeight: 900 }}>
        學習區
      </h1>

      <div style={ui.card}>
        <h2 style={ui.cardTitle}>做到一半（可續做）</h2>
        <p style={ui.cardDesc}>
          這裡只負責續做/清除。要開始新回合請回到各科入口頁。
        </p>

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {sessions.length === 0 ? (
            <div style={{ color: "#666", fontWeight: 700 }}>
              目前沒有做到一半的回合。
            </div>
          ) : (
            sessions.map((s) => (
              <div key={s.id} style={{ ...ui.card, padding: 12 }}>
                <div style={ui.pillRow}>
                  <div style={ui.pill}>科目：{s.subject}</div>
                  <div style={ui.pill}>
                    進度：第 {s.currentIndex + 1} 題 / {s.totalQuestions}
                  </div>
                  <div style={ui.pill}>
                    提示：{s.hintUsed}/{s.hintLimit}
                  </div>
                </div>

                <div style={ui.btnRow}>
                  <button
                    style={ui.btn}
                    onClick={() => router.push(`/practice/session/${s.id}`)}
                  >
                    繼續
                  </button>
                  <button
                    style={ui.btn}
                    onClick={() => {
                      removeSession(s.id);
                      refresh();
                    }}
                  >
                    清除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={ui.btnRow}>
          <button
            style={ui.btn}
            onClick={() => {
              clearAllSessions();
              refresh();
            }}
          >
            清除全部續做
          </button>
        </div>
      </div>
    </main>
  );
}