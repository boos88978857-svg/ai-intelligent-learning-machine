// app/lib/session.ts
export type Subject = "英文" | "數學" | "其他學科";

export type QuestionType = "mcq" | "application";

export type Question = {
  id: string;
  subject: Subject;
  type: QuestionType;
  prompt: string;
  hint?: string;
  tools?: {
    whiteboard?: boolean;
    abacus?: boolean;
  };
  choices?: Array<{
    id: string;
    text: string;
    correct?: boolean;
  }>;
};

export type PracticeSession = {
  id: string;
  subject: Subject;

  // 回合設定
  totalQuestions: number; // 例如 20
  maxHints: number; // 例如 5

  // 進度
  currentIndex: number; // 0-based
  elapsedSec: number;
  paused: boolean;

  // 統計
  correctCount: number;
  wrongCount: number;
  hintsUsed: number;

  // 作答狀態（簡化示範）
  currentQuestion?: Question;
  selectedChoiceId?: string | null;
  hasSubmitted?: boolean;
};

export type AnySession = PracticeSession;

const STORAGE_KEY = "ai_learning_sessions_v1";
const ACTIVE_KEY = "ai_learning_active_session_id_v1";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function readAll(): Record<string, PracticeSession> {
  if (typeof window === "undefined") return {};
  const data = safeParse<Record<string, PracticeSession>>(
    window.localStorage.getItem(STORAGE_KEY)
  );
  return data ?? {};
}

function writeAll(map: Record<string, PracticeSession>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function uid() {
  return `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

/** 建立新回合 session（可被各科入口使用） */
export function newSession(subject: Subject): PracticeSession {
  return {
    id: uid(),
    subject,
    totalQuestions: 20,
    maxHints: 5,

    currentIndex: 0,
    elapsedSec: 0,
    paused: false,

    correctCount: 0,
    wrongCount: 0,
    hintsUsed: 0,

    selectedChoiceId: null,
    hasSubmitted: false,
  };
}

/** 兼容舊版：不帶參數時取 active session；帶 subject 時取該 subject 的 active session */
export function loadSession(subject?: Subject): PracticeSession | null {
  const all = readAll();

  const activeId = getActiveSessionId();
  if (subject) {
    // 找到該 subject 的 active session：優先 activeId，否則找同 subject 最新一筆
    const active = activeId ? all[activeId] : null;
    if (active && active.subject === subject) return active;

    const list = Object.values(all).filter((s) => s.subject === subject);
    if (list.length === 0) return null;
    list.sort((a, b) => (a.id > b.id ? -1 : 1));
    return list[0] ?? null;
  }

  if (!activeId) return null;
  return all[activeId] ?? null;
}

/** 兼容舊版：直接存入（同時更新為 active） */
export function saveSession(session: PracticeSession) {
  upsertSession(session);
  setActiveSessionId(session.id);
}

/** 取得某個 id 的 session（給 session-client 用） */
export function getSession(id: string): PracticeSession | null {
  const all = readAll();
  return all[id] ?? null;
}

/** 新增或更新 session */
export function upsertSession(session: PracticeSession) {
  const all = readAll();
  all[session.id] = session;
  writeAll(all);
}

/** 刪除 session */
export function removeSession(id: string) {
  const all = readAll();
  if (all[id]) {
    delete all[id];
    writeAll(all);
  }
  // 如果刪掉的是 active，就清空 active
  const activeId = getActiveSessionId();
  if (activeId === id) {
    clearActiveSessionId();
  }
}

/** 取全部 sessions（學習區顯示“未完成可續做”會用到） */
export function loadAllSessions(): PracticeSession[] {
  const all = readAll();
  return Object.values(all);
}

/** active session id（目前使用者正在做哪一個） */
export function getActiveSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_KEY);
}

export function setActiveSessionId(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACTIVE_KEY, id);
}

export function clearActiveSessionId() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACTIVE_KEY);
}