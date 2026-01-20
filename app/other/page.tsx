// app/other/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../ui";
import { loadSession, newSession, upsertSession, Subject } from "../lib/session";

export default function OtherEntryPage() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const s = loadSession("其他" as Subject);
    setHasSession(!!s);
  }, []);

  function start() {
    const s = newSession("其他");
    upsertSession(s);
    router.push(`/practice/session/${s.id}`);
  }

  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 40, fontWeight: 900 }}>
        其他學科
      </h1>

      <div style={ui.card}>
        <h2 style={ui.cardTitle}>開始其他學科練習</h2>
        <p style={ui.cardDesc}>目前先用示範題，之後換題庫即可。</p>

        <div style={ui.btnRow}>
          <button style={ui.btn} onClick={start}>
            開始
          </button>
          {hasSession ? (
            <button style={ui.btn} onClick={() => router.push("/practice")}>
              我有做到一半 → 去學習區續做
            </button>
          ) : null}
        </div>
      </div>
    </main>
  );
}