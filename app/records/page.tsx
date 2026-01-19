// app/records/page.tsx
import { ui, CardLink } from "../ui";

export default function RecordsPage() {
  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>記錄</h1>
      <p style={{ margin: "0 0 16px", opacity: 0.75 }}>
        這裡之後放：學習時長、完成進度、錯題本、成績趨勢。
      </p>

      <div style={ui.grid2}>
        <CardLink href="/records/progress" title="進度" desc="各科完成度、連續天數" />
        <CardLink href="/records/mistakes" title="錯題本" desc="收藏錯題、回顧復習" />
      </div>
    </main>
  );
}