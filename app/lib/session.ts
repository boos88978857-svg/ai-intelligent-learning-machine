// app/lib/session.ts
export type Subject = "英文" | "數學" | "其他";

export type PracticeSession = {
  id: string;
  subject: Subject;

  // 回合設定
  totalQuestions: number; // 預設 20
  hintLimit: number; // 預設 5

  // 進度
  currentIndex: number; // 0-based
  correctCount: number;
  wrongCount: number;
  hintsUsed: number;

  // 狀態
  paused: boolean;
  elapsedSec: number;
  roundDone: boolean;

  updatedAt: number; // timestamp
};

const SESSIONS_KEY = "ai_learning_sessions_v1";
const ACTIVE_ID_KEY = "ai_learning_active_session_id_v1";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function genId() {
  // iOS/Safari/Chrome 都可用；若不行就 fallback
  // @ts-ignore
  return (globalThis.crypto?.randomUUID?.() ?? `s_${Date.now()}_${Math.random().toString(16).slice(2)}`);
}

export function loadAllSessions(): PracticeSession[] {
  if (typeof window === "undefined") return [];
  const map = safeParse<Record<string, PracticeSession>>(localStorage.getItem(SESSIONS_KEY)) ?? {};
  return Object.values(map).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getSession(id: string): PracticeSession | null {
  if (typeof window === "undefined") return null;
  const map = safeParse<Record<string, PracticeSession>>(localStorage.getItem(SESSIONS_KEY)) ?? {};
  return map[id] ?? null;
}

export function upsertSession(s: PracticeSession) {
  if (typeof window === "undefined") return;
  const map = safeParse<Record<string, PracticeSession>>(localStorage.getItem(SESSIONS_KEY)) ?? {};
  map[s.id] = { ...s, updatedAt: Date.now() };
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(map));
}

export function removeSession(id: string) {
  if (typeof window === "undefined") return;
  const map = safeParse<Record<string, PracticeSession>>(localStorage.getItem(SESSIONS_KEY)) ?? {};
  delete map[id];
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(map));

  const active = getActiveSessionId();
  if (active === id) setActiveSessionId(null);
}

export function clearAllSessions() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSIONS_KEY);
  localStorage.removeItem(ACTIVE_ID_KEY);
}

export function getActiveSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_ID_KEY);
}

export function setActiveSessionId(id: string | null) {
  if (typeof window === "undefined") return;
  if (!id) localStorage.removeItem(ACTIVE_ID_KEY);
  else localStorage.setItem(ACTIVE_ID_KEY, id);
}

export function getActiveSession(): PracticeSession | null {
  const id = getActiveSessionId();
  if (!id) return null;
  return getSession(id);
}

export function newSession(subject: Subject): PracticeSession {
  return {
    id: genId(),
    subject,
    totalQuestions: 20,
    hintLimit: 5,
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    hintsUsed: 0,
    paused: false,
    elapsedSec: 0,
    roundDone: false,
    updatedAt: Date.now(),
  };
}

/** =========================
 * 相容舊 API（避免你其他頁面還在呼叫舊名字造成紅燈）
 * 之後你穩定了再慢慢刪掉也行
 * ========================= */
export function loadSession(): PracticeSession | null {
  return getActiveSession();
}
export function saveSession(s: PracticeSession) {
  upsertSession(s);
}
export function clearSession() {
  const id = getActiveSessionId();
  if (id) removeSession(id);
}