// app/practice/page.tsx
import { ui, CardLink } from "../ui";

export default function PracticePage() {
  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>學習區</h1>
      <p style={{ margin: "0 0 16px", opacity: 0.75 }}>
        這裡放你「已完成模組」與「練習入口」的集合頁（先把入口打通）。
      </p>

      <div style={ui.grid2}>
        <CardLink href="/practice/basic" title="基礎練習" desc="先做最小可用版本（MVP）" />
        <CardLink href="/practice/advanced" title="進階練習" desc="進階題型、闖關、計時等" />
      </div>
    </main>
  );
}