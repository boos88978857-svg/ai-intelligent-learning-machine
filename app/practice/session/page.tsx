// app/practice/session/[id]/page.tsx
import SessionClient from "./session-client";

export default function PracticeSessionPage({ params }: { params: { id: string } }) {
  return <SessionClient sessionId={params.id} />;
}