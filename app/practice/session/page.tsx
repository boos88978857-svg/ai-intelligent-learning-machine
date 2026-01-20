// app/practice/session/page.tsx
import { Suspense } from "react";
import PracticeSessionClient from "./session-client";

export default function PracticeSessionPage({
  searchParams,
}: {
  searchParams?: { id?: string };
}) {
  const id = searchParams?.id ?? null;

  return (
    <Suspense fallback={<main style={{ padding: 16 }}>載入中…</main>}>
      <PracticeSessionClient id={id} />
    </Suspense>
  );
}