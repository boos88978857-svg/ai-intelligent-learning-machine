import Link from "next/link";

export default function SettingsPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>設定</h1>
      <p>之後放：音量、語音、顯示偏好、帳號設定等。</p>
      <p><Link href="/">回首頁</Link></p>
    </main>
  );
}