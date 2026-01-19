import Link from "next/link";

export default function AboutPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>關於</h1>
      <p>版本、企劃說明、更新紀錄、聯絡方式等放這裡。</p>
      <p><Link href="/">回首頁</Link></p>
    </main>
  );
}