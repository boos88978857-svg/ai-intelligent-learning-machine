// app/practice/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../ui";
import {
  PracticeSession,
  loadAllSessions,
  newSession,
  removeSession,
  setActiveSessionId,
  upsertSession,
} from "../lib/session";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function PracticeHubPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<PracticeSession[]>([]);

  useEffect(() => {
    setSessions(loadAllSessions());
  }, []);

  function start(subject: PracticeSession["subject"]) {
    const s = newSession(subject);
    upsertSession(s);
    setActiveSessionId(s.id);
    setSessions(loadAllSessions());
    router.push(`/practice/session?id=${encodeURIComponent(s.id)}`);
  }

  function resume(id: string) {
    setActiveSessionId(id);
    router.push(`/practice/session?id=${encodeURIComponent(id)}`);
  }

  function remove(id: string) {
    removeSession(id);
    setSessions(loadAllSessions());
  }

  const unfinished = sessions.filter((s) => !s.roundDone);
  const finished = sessions.filter((s) => s.roundDone);

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>學習區</h1>
      <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡是「續做中心」：你可以同時保留多個科目回合，隨時切換、繼續或清除。
      </p>

      <div style={ui.grid2}>
        <button onClick={() => start("英文")} style={{ ...ui.card, textAlign: "left", cursor: "pointer" }}>
          <h2 style={ui.cardTitle}>開始英文練習</h2>
          <p style={ui.cardDesc}>建立新回合（20 題 / 5 次提示）</p>
          <span style={ui.smallLink}>開始 →</span>
        </button>

        <button onClick={() => start("數學")} style={{ ...ui.card, textAlign: "left", cursor: "pointer" }}>
          <h2 style={ui.cardTitle}>開始數學練習</h2>
          <p style={ui.cardDesc}>建立新回合（20 題 / 5 次提示）</p>
          <span style={ui.smallLink}>開始 →</span>
        </button>
      </div>

      {/* 未完成回合 */}
      <div style={{ marginTop: 18 }}>
        <h2 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 900 }}>未完成回合</h2>

        {unfinished.length === 0 ? (
          <div style={{ opacity: 0.7 }}>目前沒有未完成回合。</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {unfinished.map((s) => (
              <div key={s.id} style={ui.card}>
                <h3 style={{ ...ui.cardTitle, fontSize: 20 }}>{s.subject}（回合）</h3>
                <p style={ui.cardDesc}>
                  進度：第 {s.currentIndex + 1} 題 / {s.totalQuestions}
                  <br />
                  計時：{formatTime(s.elapsedSec)}
                  <br />
                  狀態：{s.paused ? "已暫停" : "進行中"}
                </p>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
                  <button onClick={() => resume(s.id)} style={{ ...ui.navBtn, cursor: "pointer" }}>
                    繼續作答 →
                  </button>
                  <button onClick={() => remove(s.id)} style={{ ...ui.navBtn, cursor: "pointer" }}>
                    清除回合
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 已完成回合（先留入口） */}
      {finished.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <h2 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 900 }}>已完成（保留紀錄）</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {finished.map((s) => (
              <div key={s.id} style={ui.card}>
                <h3 style={{ ...ui.cardTitle, fontSize: 20 }}>{s.subject}（已完成）</h3>
                <p style={ui.cardDesc}>
                  題數：{s.totalQuestions}　對：{s.correctCount}　錯：{s.wrongCount}　提示：{s.hintsUsed}/{s.hintLimit}
                  <br />
                  總用時：{formatTime(s.elapsedSec)}
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
                  <button onClick={() => remove(s.id)} style={{ ...ui.navBtn, cursor: "pointer" }}>
                    刪除此紀錄
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Link href="/" style={ui.navBtn}>回首頁</Link>
      </div>
    </main>
  );
}