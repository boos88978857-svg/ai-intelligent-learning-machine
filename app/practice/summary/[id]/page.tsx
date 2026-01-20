// app/practice/summary/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../../../ui";
import { getSession, removeSession, PracticeSession } from "../../../lib/session";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function SummaryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [s, setS] = useState<PracticeSession | null>(null);

  useEffect(() => {
    const ss = getSession(params.id);
    if (!ss) {
      router.replace("/practice");
      return;
    }
    setS(ss);
  }, [params.id, router]);

  if (!s) return null;

  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 44, fontWeight: 900 }}>
        回合完成 ✅
      </h1>

      <div style={ui.card}>
        <h2 style={ui.cardTitle}>統計</h2>
        <p style={ui.cardDesc}>
          科目：{s.subject}
          <br />
          題數：{s.totalQuestions}
          <br />
          對：{s.correctCount}　錯：{s.wrongCount}
          <br />
          提示：{s.hintUsed}/{s.hintLimit}
          <br />
          總用時：{formatTime(s.elapsedSec)}
        </p>

        <div style={ui.btnRow}>
          <button style={ui.btn} onClick={() => router.replace("/practice")}>
            回學習區
          </button>
          <button
            style={ui.btn}
            onClick={() => {
              removeSession(s.id);
              router.replace("/");
            }}
          >
            回首頁
          </button>
        </div>
      </div>
    </main>
  );
}