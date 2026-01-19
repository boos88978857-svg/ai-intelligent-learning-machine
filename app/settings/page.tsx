"use client";

import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ margin: "0 0 12px", fontSize: 28, fontWeight: 800 }}>
        設定
      </h1>

      <p style={{ opacity: 0.75, lineHeight: 1.7 }}>
        這裡之後會放使用偏好、音效、音標顯示習慣等設定。
      </p>

      <button
        onClick={() => router.back()}
        style={{
          display: "inline-block",
          marginTop: 16,
          color: "#1d4ed8",
          background: "none",
          border: "none",
          padding: 0,
          fontSize: 16,
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        ← 回上一頁
      </button>
    </main>
  );
}