import Link from "next/link";

export default function ArenaPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>學習競技場</h1>
      <p>先把入口與路由打通，之後再做對戰／排名／任務。</p>
      <p><Link href="/">回首頁</Link></p>
    </main>
  );
}