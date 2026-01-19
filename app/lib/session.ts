export type Subject = "英文" | "數學";

export type PracticeSession = {
  id: string;
  subject: Subject;
  currentIndex: number; // 第幾題（從 0 開始）
  elapsedSec: number;   // 已用秒數
  paused: boolean;
  updatedAt: number;    // timestamp
};

const KEY = "ai_learning_practice_session_v1";

export function loadSession(): PracticeSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PracticeSession;
  } catch {
    return null;
  }
}

export function saveSession(s: PracticeSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function newSession(subject: Subject): PracticeSession {
  return {
    id: crypto.randomUUID(),
    subject,
    currentIndex: 0,
    elapsedSec: 0,
    paused: false,
    updatedAt: Date.now(),
  };
}