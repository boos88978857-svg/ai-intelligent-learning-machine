import Link from "next/link";

export default function MathPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>數學專區</h1>
      <p>這裡先把入口打通，後面再放分級題庫與練習。</p>
      <p><Link href="/">回首頁</Link></p>
    </main>
  );
}