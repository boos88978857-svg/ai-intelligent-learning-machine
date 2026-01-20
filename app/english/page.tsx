// app/english/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ui } from "../ui";
import { newSession, upsertSession, setActiveSessionId } from "../lib/session";

const levels = [
  { id: "A1", title: "A1" },
  { id: "A2", title: "A2" },
  { id: "B1", title: "B1" },
  { id: "B2", title: "B2" },
  { id: "C1", title: "C1" },
  { id: "C2", title: "C2" },
  { id: "TOEIC", title: "多益" },
] as const;

export default function EnglishPage() {
  const router = useRouter();

  function goLearn(level: string) {
    router.push(`/english/learn?level=${encodeURIComponent(level)}`);
  }

  function startPractice(level: string) {
    const s = newSession("英文");
    // 先用 url 帶 level，下一步我們會把 level 存進 session 結構（避免只靠 url）
    upsertSession(s);
    setActiveSessionId(s.id);
    router.push(`/practice/session?id=${encodeURIComponent(s.id)}&level=${encodeURIComponent(level)}`);
  }

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 10px", fontSize: 34, fontWeight: 900 }}>
        英文專區
      </h1>

      <p style={{ margin: "0 0 14px", opacity: 0.75, lineHeight: 1.7 }}>
        請先選擇階段，再進入「學習」或「練習」。練習會建立可中斷續做的回合。
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {levels.map((lv) => (
          <div key={lv.id} style={ui.card}>
            <h2 style={{ ...ui.cardTitle, marginBottom: 8 }}>{lv.title}</h2>
            <p style={{ ...ui.cardDesc, margin: "0 0 12px" }}>
              進入學習內容或開始練習（20 題 / 5 次提示）
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={() => goLearn(lv.id)}
                style={{ ...ui.navBtn, cursor: "pointer" }}
              >
                📘 學習
              </button>

              <button
                onClick={() => startPractice(lv.id)}
                style={{ ...ui.navBtn, cursor: "pointer" }}
              >
                ✅ 練習
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}