// app/practice/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ui } from "../ui";
import { clearSession, loadAllSessions } from "../lib/session";

type AnySession = {
  subject: string;
  currentIndex: number;
  totalQuestions: number;
  elapsedSec: number;
  paused: boolean;
  correctCount?: number;
  wrongCount?: number;
  hintUsed?: number;
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function PracticeHubPage() {
  const [sessions, setSessions] = useState<Record<string, AnySession>>({});

  function refresh() {
    setSessions(loadAllSessions());
  }

  useEffect(() => {
    refresh();
    // 讓你從別頁回來也會更新（同一個分頁）
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const subjects = useMemo(() => {
    const keys = Object.keys(sessions || {});
    // 你想固定排序也可以改這裡
    return keys.sort();
  }, [sessions]);

  function onClear(subject: string) {
    clearSession(subject);
    refresh();
  }

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 10px", fontSize: 34, fontWeight: 900 }}>學習區</h1>
      <p style={{ margin: "0 0 18px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡只負責「續做中心」：顯示你有哪些科目做到一半，可以繼續或清除。
      </p>

      {subjects.length === 0 ? (
        <div style={ui.card}>
          <h2 style={ui.cardTitle}>目前沒有續做</h2>
          <p style={ui.cardDesc}>請先到各科入口開始練習，做到一半就會出現在這裡。</p>
          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/" style={ui.navBtn}>
              回首頁
            </Link>
            <Link href="/english" style={ui.navBtn}>
              去英文專區
            </Link>
            <Link href="/math" style={ui.navBtn}>
              去數學專區
            </Link>
          </div>
        </div>
      ) : (
        <div style={ui.grid2}>
          {subjects.map((subject) => {
            const s = sessions[subject];
            if (!s) return null;

            const correct = s.correctCount ?? 0;
            const wrong = s.wrongCount ?? 0;
            const hintUsed = s.hintUsed ?? 0;

            return (
              <div key={subject} style={ui.card}>
                <h2 style={ui.cardTitle}>{subject}（續做）</h2>
                <p style={ui.cardDesc}>
                  進度：第 {s.currentIndex + 1} 題 / {s.totalQuestions}
                  <br />
                  計時：{formatTime(s.elapsedSec)}
                  <br />
                  狀態：{s.paused ? "已暫停" : "進行中"}
                  <br />
                  對：{correct}　錯：{wrong}　提示：{hintUsed}
                </p>

                <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link href={`/practice/session?subject=${encodeURIComponent(subject)}`} style={ui.navBtn}>
                    繼續
                  </Link>

                  <button
                    type="button"
                    onClick={() => onClear(subject)}
                    style={{ ...ui.navBtn, cursor: "pointer" }}
                  >
                    清除
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}