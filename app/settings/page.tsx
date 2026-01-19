// app/settings/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ margin: "0 0 12px", fontSize: 32, fontWeight: 800 }}>
        設定
      </h1>

      <p style={{ opacity: 0.75, lineHeight: 1.7 }}>
        之後會放：
        <br />
        ・作答偏好（音標 / 題型）
        <br />
        ・聲音 / 介面設定
        <br />
        ・學習習慣記憶
      </p>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => router.back()}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid #ccc",
            background: "white",
            cursor: "pointer",
          }}
        >
          ← 回上一頁
        </button>
      </div>
    </main>
  );
}