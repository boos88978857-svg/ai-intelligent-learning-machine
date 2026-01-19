// app/page.tsx
import { ui, CardLink } from "./ui";

export default function Page() {
  return (
    <main>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 40, fontWeight: 900 }}>AI 智能學習機</h1>
        <p style={{ margin: "8px 0 0", opacity: 0.75 }}>請選擇入口開始學習</p>
      </header>

      <div style={ui.grid2}>
        <CardLink
          href="/english"
          title="英文專區"
          desc="A1–C2、TOEIC、學習 + 練習"
        />
        <CardLink
          href="/math"
          title="數學專區"
          desc="國小 / 國中 / 高中分級練習"
        />
        <CardLink
          href="/subjects"
          title="其他學科"
          desc="之後擴充：國文、理化、歷史等"
        />
        <CardLink
          href="/arena"
          title="學習競技場"
          desc="對戰 / 排名 / 任務（入口先打通）"
        />
      </div>
    </main>
  );
}