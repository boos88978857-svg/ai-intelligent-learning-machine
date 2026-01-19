// app/settings/page.tsx
import { ui, CardLink } from "../ui";

export default function SettingsPage() {
  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>設定</h1>
      <p style={{ margin: "0 0 16px", opacity: 0.75 }}>
        這裡之後放：聲音、偏好、通知、帳號等。
      </p>

      <div style={ui.grid2}>
        <CardLink href="/settings/profile" title="個人檔案" desc="名稱、頭像、目標" />
        <CardLink href="/settings/preferences" title="偏好" desc="語言、聲音、顯示設定" />
      </div>
    </main>
  );
}