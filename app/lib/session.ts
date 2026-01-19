// app/lib/session.ts
export type Subject = "英文" | "數學" | "其他";

export type PracticeSession = {
  id: string;
  subject: Subject;
  currentIndex: number; // 第幾題（從 0 開始）
  elapsedSec: number;   // 已用秒數
  paused: boolean;
  updatedAt: number;    // 時間戳
};

const KEY = "ai_learning_sessions_v1";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadAllSessions(): PracticeSession[] {
  if (typeof window === "undefined") return [];
  const parsed = safeParse<PracticeSession[]>(window.localStorage.getItem(KEY));
  return Array.isArray(parsed) ? parsed : [];
}

export function saveAllSessions(list: PracticeSession[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function getSession(id: string): PracticeSession | null {
  const list = loadAllSessions();
  return list.find((s) => s.id === id) ?? null;
}

export function upsertSession(s: PracticeSession) {
  const list = loadAllSessions();
  const idx = list.findIndex((x) => x.id === s.id);
  const next = { ...s, updatedAt: Date.now() };
  if (idx >= 0) list[idx] = next;
  else list.unshift(next);
  saveAllSessions(list);
}

export function removeSession(id: string) {
  const list = loadAllSessions().filter((s) => s.id !== id);
  saveAllSessions(list);
}

export function newSession(subject: Subject): PracticeSession {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now()),
    subject,
    currentIndex: 0,
    elapsedSec: 0,
    paused: false,
    updatedAt: Date.now(),
  };
}