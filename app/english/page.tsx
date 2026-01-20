// app/english/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ui } from "../ui";
import { loadAllSessions } from "../lib/session";

type SimpleSession = {
  subject: string;
  currentIndex: number;
  totalQuestions: number;
  elapsedSec: number;
  paused: boolean;
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function EnglishPage() {
  const [hasResume, setHasResume] = useState(false);
  const [resumeInfo, setResumeInfo] = useState<SimpleSession | null>(null);

  useEffect(() => {
    // 只看英文是否有續做
    const all = loadAllSessions();
    const s = all["英文"];
    if (s) {
      setHasResume(true);
      setResumeInfo({
        subject: s.subject,
        currentIndex: s.currentIndex,
        totalQuestions: s.totalQuestions,
        elapsedSec: s.elapsedSec,
        paused: s.paused,
      });
    } else {
      setHasResume(false);
      setResumeInfo(null);
    }
  }, []);

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 10px", fontSize: 34, fontWeight: 900 }}>英文專區</h1>
      <p style={{ margin: "0 0 18px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡是英文的入口頁。之後會再細分 A1–C2、TOEIC 等模組。
      </p>

      {/* 入口卡 */}
      <div style={ui.grid2}>
        {/* 學習 */}
        <Link href="/english/learn?level=A1" style={ui.card}>
          <h2 style={ui.cardTitle}>學習</h2>
          <p style={ui.cardDesc}>單字 / 音標偏好 / 發音（入口先打通）</p>
          <div style={{ marginTop: 10, opacity: 0.7 }}>進入 →</div>
        </Link>

        {/* 練習（建立新回合） */}
        <Link href="/practice?subject=英文" style={ui.card}>
          <h2 style={ui.cardTitle}>練習</h2>
          <p style={ui.cardDesc}>開始新的練習回合（20 題 / 5 次提示）</p>
          <div style={{ marginTop: 10, opacity: 0.7 }}>開始 →</div>
        </Link>

        {/* 續做 */}
        <Link
          href={hasResume ? "/practice/session?subject=英文" : "#"}
          style={{
            ...ui.card,
            opacity: hasResume ? 1 : 0.45,
            pointerEvents: hasResume ? "auto" : "none",
          }}
        >
          <h2 style={ui.cardTitle}>續做</h2>
          <p style={ui.cardDesc}>
            {hasResume && resumeInfo ? (
              <>
                進度：第 {resumeInfo.currentIndex + 1} 題 / {resumeInfo.totalQuestions}
                <br />
                計時：{formatTime(resumeInfo.elapsedSec)}
                <br />
                狀態：{resumeInfo.paused ? "已暫停" : "進行中"}
              </>
            ) : (
              "目前沒有做到一半的英文練習"
            )}
          </p>
          <div style={{ marginTop: 10, opacity: 0.7 }}>{hasResume ? "繼續 →" : "尚無 →"}</div>
        </Link>

        {/* 回首頁 */}
        <Link href="/" style={ui.card}>
          <h2 style={ui.cardTitle}>回首頁</h2>
          <p style={ui.cardDesc}>回到四大入口</p>
          <div style={{ marginTop: 10, opacity: 0.7 }}>返回 →</div>
        </Link>
      </div>
    </main>
  );
}