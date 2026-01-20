// app/practice/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../ui";
import {
  PracticeSession,
  loadAllSessions,
  removeSession,
  setActiveSessionId,
} from "../lib/session";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function PracticeHubPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<PracticeSession[]>([]);

  function refresh() {
    setSessions(loadAllSessions());
  }

  useEffect(() => {
    refresh();
  }, []);

  const unfinished = sessions.filter((s) => !s.roundDone);

  function resume(id: string) {
    setActiveSessionId(id);
    router.push(`/practice/session?id=${encodeURIComponent(id)}`);
  }

  function clearOne(id: string) {
    removeSession(id);
    refresh();
  }

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 10px", fontSize: 34, fontWeight: 900 }}>
        學習區
      </h1>

      <p style={{ margin: "0 0 14px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡是「續做中心」：你在各專區選好階段/年級後開始作答，若中斷可在此繼續或清除。
      </p>

      <div style={ui.card}>
        <h2 style={{ ...ui.cardTitle, marginBottom: 10 }}>未完成回合</h2>

        {unfinished.length === 0 ? (
          <p style={{ margin: 0, opacity: 0.7 }}>
            目前沒有未完成回合。請到「英文專區 / 數學專區 / 其他學科」選擇階段後開始。
          </p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {unfinished.map((s) => (
              <div key={s.id} style={{ ...ui.card, marginBottom: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 900 }}>
                      {s.subject}（回合）
                    </div>
                    <div style={{ marginTop: 6, opacity: 0.75, lineHeight: 1.7 }}>
                      進度：第 {s.currentIndex + 1} 題 / {s.totalQuestions}
                      <br />
                      對 {s.correctCount}　錯 {s.wrongCount}　提示 {s.hintLimit}/{s.hintsUsed}
                      <br />
                      用時：{formatTime(s.elapsedSec)}　狀態：{s.paused ? "已暫停" : "進行中"}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() => resume(s.id)}
                      style={{ ...ui.navBtn, cursor: "pointer" }}
                    >
                      繼續 →
                    </button>
                    <button
                      onClick={() => clearOne(s.id)}
                      style={{ ...ui.navBtn, cursor: "pointer" }}
                    >
                      清除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}