// app/lib/session.ts
export type Subject = "英文" | "數學" | "其他";

export type PracticeSession = {
  id: string;
  subject: Subject;

  totalQuestions: number; // 每回合題數（預設 20）
  hintLimit: number; // 每回合提示上限（預設 5）

  currentIndex: number; // 0-based
  correctCount: number;
  wrongCount: number;
  hintsUsed: number;

  paused: boolean;
  elapsedSec: number;
  roundDone: boolean;

  updatedAt: number; // timestamp
};

const SESSIONS_KEY = "ai_learning_sessions_v2"; // ✅ 新 key，避免跟舊資料互相污染
const ACTIVE_ID_KEY = "ai_learning_active_session_id_v2";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function genId() {
  // iOS/Safari/Chrome 皆可
  // @ts-ignore
  return globalThis.crypto?.randomUUID?.() ?? `s_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/** ========== 多回合：讀寫整包 ========== */
function loadMap(): Record<string, PracticeSession> {
  if (typeof window === "undefined") return {};
  return safeParse<Record<string, PracticeSession>>(localStorage.getItem(SESSIONS_KEY)) ?? {};
}

function saveMap(map: Record<string, PracticeSession>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(map));
}

export function loadAllSessions(): PracticeSession[] {
  const map = loadMap();
  return Object.values(map).sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
}

export function getSession(id: string): PracticeSession | null {
  const map = loadMap();
  return map[id] ?? null;
}

export function upsertSession(s: PracticeSession) {
  const map = loadMap();
  map[s.id] = { ...s, updatedAt: Date.now() };
  saveMap(map);
}

export function removeSession(id: string) {
  const map = loadMap();
  delete map[id];
  saveMap(map);

  // 如果刪掉的是 active，就清掉 active
  const active = getActiveSessionId();
  if (active === id) setActiveSessionId(null);
}

export function clearAllSessions() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSIONS_KEY);
  localStorage.removeItem(ACTIVE_ID_KEY);
}

/** ========== Active Session（目前作答中的回合） ========== */
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

/** ========== 建立新回合 ========== */
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

/** ========== 舊 API 相容（讓你現有頁面先不壞） ========== */
/** 讀取目前 active 的回合 */
export function loadSession(): PracticeSession | null {
  return getActiveSession();
}

/** 儲存目前 active 的回合（或指定 id 的回合） */
export function saveSession(s: PracticeSession) {
  upsertSession(s);
  // 確保 active 指向它
  setActiveSessionId(s.id);
}

/** 清除目前 active 的回合 */
export function clearSession() {
  const id = getActiveSessionId();
  if (id) removeSession(id);
}