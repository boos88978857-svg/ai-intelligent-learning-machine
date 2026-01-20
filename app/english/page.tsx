// app/english/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ui } from "../ui";
import { loadSession } from "../lib/session";

export default function EnglishPage() {
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const s = loadSession("英文");
    setHasSession(!!s);
  }, []);

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>英文專區</h1>

      <div style={ui.card}>
        <h2 style={ui.cardTitle}>入口（示範）</h2>
        <p style={ui.cardDesc}>
          這裡之後會放「選擇階段 / 題庫模式」再開始回合。
          <br />
          目前先保留「續做」入口。
        </p>

        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {hasSession ? (
            <Link href="/practice/session" style={{ ...ui.navBtn, textDecoration: "none" }}>
              續做未完成
            </Link>
          ) : (
            <span style={{ opacity: 0.6 }}>目前沒有未完成可續做</span>
          )}
        </div>
      </div>

      <button onClick={() => history.back()} style={ui.backLink}>
        ← 回上一頁
      </button>
    </main>
  );
}