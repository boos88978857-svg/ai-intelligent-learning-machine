// app/english/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../ui";
import { loadSession, newSession, saveSession } from "../lib/session";

type AnySession = {
  subject: string;
  currentIndex: number;
  totalQuestions: number;
  elapsedSec: number;
  paused: boolean;
};

export default function EnglishPage() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const s = loadSession("英文") as AnySession | null;
    setHasSession(!!s);
  }, []);

  function goContinue() {
    router.push(`/practice/session?subject=${encodeURIComponent("英文")}`);
  }

  function startNew() {
    const s = newSession("英文") as AnySession;
    saveSession(s);
    router.push(`/practice/session?subject=${encodeURIComponent("英文")}`);
  }

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>英文專區</h1>
      <p style={{ margin: "0 0 18px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡之後會接：分級、題庫、課程、音標偏好等。
        <br />
        目前先把「開始 / 續做」入口打通。
      </p>

      <div style={ui.card}>
        <h2 style={ui.cardTitle}>{hasSession ? "你有一個英文續做" : "開始英文練習"}</h2>
        <p style={ui.cardDesc}>
          {hasSession
            ? "你之前做到一半的英文作答仍保留，可直接繼續。"
            : "將建立一個新的英文作答進度（可中斷續做）。"}
        </p>

        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {hasSession ? (
            <button type="button" onClick={goContinue} style={{ ...ui.navBtn, cursor: "pointer" }}>
              繼續作答
            </button>
          ) : (
            <button type="button" onClick={startNew} style={{ ...ui.navBtn, cursor: "pointer" }}>
              開始新練習
            </button>
          )}

          <Link href="/practice" style={ui.navBtn}>
            去學習區（續做中心）
          </Link>

          <Link href="/" style={ui.navBtn}>
            回首頁
          </Link>
        </div>
      </div>
    </main>
  );
}