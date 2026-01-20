// app/english/learn/learn-client.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ui } from "../../ui";

type PhoneticType = "ipa" | "kk";

export default function EnglishLearnClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const level = sp.get("level") ?? "A1";

  const [phonetic, setPhonetic] = useState<PhoneticType>("ipa");

  useEffect(() => {
    const saved = localStorage.getItem("ai_learning_phonetic_pref");
    if (saved === "ipa" || saved === "kk") setPhonetic(saved);
  }, []);

  function changePhonetic(t: PhoneticType) {
    setPhonetic(t);
    localStorage.setItem("ai_learning_phonetic_pref", t);
  }

  function playPronunciation() {
    alert(phonetic === "ipa" ? "播放 IPA 發音（示範）" : "播放 KK 發音（示範）");
  }

  return (
    <main style={ui.wrap}>
      <h1 style={{ margin: "0 0 10px", fontSize: 34, fontWeight: 900 }}>
        英文學習｜{level}
      </h1>

      <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡是學習頁（非出題）。可切換音標類型，系統會記住你的習慣，
        並在之後練習與出題時沿用。
      </p>

      <div style={ui.card}>
        <h2 style={ui.cardTitle}>音標設定</h2>
        <p style={ui.cardDesc}>
          選擇你習慣的音標系統，之後學習與練習都會依此顯示與發音。
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button
            onClick={() => changePhonetic("ipa")}
            style={{
              ...ui.navBtn,
              border: phonetic === "ipa" ? "2px solid rgba(29,78,216,0.6)" : undefined,
            }}
          >
            IPA 國際音標
          </button>

          <button
            onClick={() => changePhonetic("kk")}
            style={{
              ...ui.navBtn,
              border: phonetic === "kk" ? "2px solid rgba(29,78,216,0.6)" : undefined,
            }}
          >
            KK 音標
          </button>
        </div>
      </div>

      <div style={{ ...ui.card, marginTop: 14 }}>
        <h2 style={ui.cardTitle}>單字示範（框架）</h2>

        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 22, fontWeight: 900 }}>apple</div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            {phonetic === "ipa" ? "/ˈæp.əl/" : "[ˋæpəl]"}
          </div>

          <div style={{ marginTop: 12 }}>
            <button onClick={playPronunciation} style={{ ...ui.navBtn, cursor: "pointer" }}>
              🔊 播放發音
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={() => router.back()} style={{ ...ui.navBtn, cursor: "pointer" }}>
          ← 回上一頁
        </button>
      </div>
    </main>
  );
}