import Link from "next/link";

export default function LearnPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>學習區</h1>
      <p>這裡是「學習區」總入口（之後可放你的模組、課程、任務）。</p>
      <ul>
        <li><Link href="/english">前往：英文專區</Link></li>
        <li><Link href="/math">前往：數學專區</Link></li>
        <li><Link href="/subjects">前往：其他學科</Link></li>
        <li><Link href="/arena">前往：學習競技場</Link></li>
      </ul>
      <p><Link href="/">回首頁</Link></p>
    </main>
  );
}