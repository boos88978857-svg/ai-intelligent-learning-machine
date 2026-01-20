// app/practice/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../ui";
import {
  PracticeSession,
  loadAllSessions,
  newSession,
  upsertSession,
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
  const finished = sessions.filter((s) => s.roundDone);

  function start(subject: PracticeSession["subject"]) {
    const s = newSession(subject);
    upsertSession(s);
    setActiveSessionId(s.id);
    refresh();
    router.push(`/practice/session?id=${encodeURIComponent(s.id)}`);
  }

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
      <h1 style={{ margin: "0 0 10px", fontSize: 34, fontWeight: 900 }}>學習區</h1>
      <p style={{ margin: "0 0 14px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡是「續做中心」：你可以同時保留多個科目的未完成回合，隨時切換、繼續或清除。
      </p>

      {/* ✅ 未完成回合列表 */}
      <div style={{ ...ui.card, marginBottom: 14 }}>
        <h2 style={{ ...ui.cardTitle, marginBottom: 10 }}>未完成回合</h2>

        {unfinished.length === 0 ? (
          <p style={{ margin: 0, opacity: 0.7 }}>目前沒有未完成回合。</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {unfinished.map((s) => (
              <div key={s.id} style={{ ...ui.card, marginBottom: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 900 }}>{s.subject}（回合）</div>
                    <div style={{ marginTop: 6, opacity: 0.75, lineHeight: 1.7 }}>
                      進度：第 {s.currentIndex + 1} 題 / {s.totalQuestions}
                      <br />
                      對 {s.correctCount}　錯 {s.wrongCount}　提示 {s.hintLimit}/{s.hintsUsed}
                      <br />
                      用時：{formatTime(s.elapsedSec)}　狀態：{s.paused ? "已暫停" : "進行中"}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <button onClick={() => resume(s.id)} style={{ ...ui.navBtn, cursor: "pointer" }}>
                      繼續 →
                    </button>
                    <button onClick={() => clearOne(s.id)} style={{ ...ui.navBtn, cursor: "pointer" }}>
                      清除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ 開始新回合入口 */}
      <div style={ui.card}>
        <h2 style={{ ...ui.cardTitle, marginBottom: 10 }}>開始新回合</h2>

        <div style={ui.grid2}>
          <button onClick={() => start("英文")} style={{ ...ui.card, textAlign: "left", cursor: "pointer" }}>
            <h3 style={{ ...ui.cardTitle, fontSize: 20 }}>英文</h3>
            <p style={ui.cardDesc}>20 題 / 5 次提示（可中斷續做）</p>
            <span style={ui.smallLink}>開始 →</span>
          </button>

          <button onClick={() => start("數學")} style={{ ...ui.card, textAlign: "left", cursor: "pointer" }}>
            <h3 style={{ ...ui.cardTitle, fontSize: 20 }}>數學</h3>
            <p style={ui.cardDesc}>20 題 / 5 次提示（可中斷續做）</p>
            <span style={ui.smallLink}>開始 →</span>
          </button>

          <button onClick={() => start("其他")} style={{ ...ui.card, textAlign: "left", cursor: "pointer" }}>
            <h3 style={{ ...ui.cardTitle, fontSize: 20 }}>其他科目</h3>
            <p style={ui.cardDesc}>先把入口打通，後續可擴充題庫</p>
            <span style={ui.smallLink}>開始 →</span>
          </button>
        </div>

        {finished.length > 0 && (
          <div style={{ marginTop: 14, opacity: 0.75, lineHeight: 1.7 }}>
            已完成回合：{finished.length}（目前先保留在本機，之後可做紀錄頁統整）
          </div>
        )}
      </div>
    </main>
  );
}