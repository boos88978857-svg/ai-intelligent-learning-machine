import Link from "next/link";

export default function RecordsPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>記錄</h1>
      <p>之後放：學習紀錄、練習紀錄、錯題本、進度條等。</p>
      <p><Link href="/">回首頁</Link></p>
    </main>
  );
}