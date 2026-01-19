// app/math/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ui } from "../ui";

export default function MathPage() {
  const router = useRouter();

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>
        數學專區
      </h1>

      <p style={{ margin: "0 0 16px", opacity: 0.75, lineHeight: 1.7 }}>
        這裡先把入口打通，後面再放分級題庫與練習。
      </p>

      <button
        onClick={() => router.back()}
        style={{ ...ui.navBtn, cursor: "pointer" }}
      >
        ← 回上一頁
      </button>
    </main>
  );
}