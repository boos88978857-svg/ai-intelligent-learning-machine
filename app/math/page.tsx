// app/math/page.tsx
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

export default function MathPage() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const s = loadSession("數學") as AnySession | null;
    setHasSession(!!s);
  }, []);

  function goContinue() {
    router.push(`/practice/session?subject=${encodeURIComponent("數學")}`);
  }

  function startNew() {
    const s = newSession("數學") as AnySession;
    saveSession(s);
    router.push(`/practice/session?subject=${encodeURIComponent("數學")}`);
  }

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>數學專區</h1>
      <p style={{ margin: "0 0 18px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡之後會接：國小 / 國中 / 高中分級、題庫與工具（塗鴉板 / 算盤）。
        <br />
        目前先把「開始 / 續做」入口打通。
      </p>

      <div style={ui.card}>
        <h2 style={ui.cardTitle}>{hasSession ? "你有一個數學續做" : "開始數學練習"}</h2>
        <p style={ui.cardDesc}>
          {hasSession
            ? "你之前做到一半的數學作答仍保留，可直接繼續。"
            : "將建立一個新的數學作答進度（可中斷續做）。"}
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