import Link from "next/link";

export default function EnglishPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>英文專區</h1>
      <p>這裡先把入口打通，後面再放你的課程與練習模組。</p>
      <p><Link href="/">回首頁</Link></p>
    </main>
  );
}