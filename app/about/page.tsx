// app/about/page.tsx
export default function AboutPage() {
  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900 }}>關於</h1>
      <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.7 }}>
        AI 智能學習機：以「入口清晰、模組化練習、記錄可視化、競技化動機」為核心。
        <br />
        目前階段：先把所有入口與頁面骨架打通，確保不再出現 404。
      </p>
    </main>
  );
}