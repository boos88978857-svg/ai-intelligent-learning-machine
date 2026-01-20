// app/english/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../ui";
import { loadSession } from "../lib/session";

export default function EnglishEntryPage() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const s = loadSession("英文");
    setHasSession(!!s);
  }, []);

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 1000 }}>
        英文專區
      </h1>

      <div style={ui.card}>
        <h2 style={ui.cardTitle}>入口</h2>
        <p style={ui.cardDesc}>
          现在英文会走「阶段选择 → 出题」。学习区只负责续做。
        </p>

        {hasSession && (
          <div style={{ marginTop: 10 }}>
            <span
              style={ui.smallLink}
              onClick={() => router.push("/practice")}
            >
              有做到一半 → 去學習區續做
            </span>
          </div>
        )}
      </div>

      <div style={{ marginTop: 18 }}>
        <span style={ui.backLink} onClick={() => router.back()}>
          ← 回上一頁
        </span>
      </div>
    </main>
  );
}