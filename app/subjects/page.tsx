import Link from "next/link";

export default function SubjectsPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>其他學科</h1>
      <p>先放入口頁，之後再擴充國文／理化／歷史等模組。</p>
      <p><Link href="/">回首頁</Link></p>
    </main>
  );
}