// app/english/learn/page.tsx
import { Suspense } from "react";
import EnglishLearnClient from "./learn-client";

export default function EnglishLearnPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>載入中…</div>}>
      <EnglishLearnClient />
    </Suspense>
  );
}