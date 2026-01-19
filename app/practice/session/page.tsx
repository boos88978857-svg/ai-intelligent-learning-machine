// app/practice/session/page.tsx
import { Suspense } from "react";
import PracticeSessionClient from "./session-client";

export default function PracticeSessionPage() {
  return (
    <Suspense fallback={<main style={{ padding: 16 }}>載入中…</main>}>
      <PracticeSessionClient />
    </Suspense>
  );
}