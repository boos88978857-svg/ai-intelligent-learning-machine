// app/lib/session.ts
export type Subject = "英文" | "數學" | "其他";

export type SessionStatus = "in_progress" | "done";

export type PracticeSession = {
  id: string;
  subject: Subject;

  totalQuestions: number; // 20
  currentIndex: number; // 0..19

  elapsedSec: number;
  paused: boolean;

  correctCount: number;
  wrongCount: number;

  hintLimit: number; // 5
  hintUsed: number;

  status: SessionStatus;

  createdAt: number;
  updatedAt: number;
};

const KEY = "aim:sessions:v1";

type Store = Record<string, PracticeSession>;

function readStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Store;
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(store));
}

function genId() {
  return `s_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

/** 建新回合（注意：这里统一 20 题 / 5 次提示） */
export function newSession(subject: Subject): PracticeSession {
  const now = Date.now();
  const s: PracticeSession = {
    id: genId(),
    subject,
    totalQuestions: 20,
    currentIndex: 0,
    elapsedSec: 0,
    paused: false,
    correctCount: 0,
    wrongCount: 0,
    hintLimit: 5,
    hintUsed: 0,
    status: "in_progress",
    createdAt: now,
    updatedAt: now,
  };
  return s;
}

/** 写入或更新 */
export function upsertSession(s: PracticeSession) {
  const store = readStore();
  store[s.id] = { ...s, updatedAt: Date.now() };
  writeStore(store);
}

/** 取得单一 session */
export function getSession(id: string): PracticeSession | null {
  const store = readStore();
  return store[id] ?? null;
}

/** 删除某个 session */
export function removeSession(id: string) {
  const store = readStore();
  delete store[id];
  writeStore(store);
}

/** 列出全部（只回传未完成，学习区只负责续做） */
export function listInProgressSessions(): PracticeSession[] {
  const store = readStore();
  return Object.values(store)
    .filter((s) => s.status === "in_progress")
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

/** 方便旧代码兼容：loadSession() / loadSession(subject) */
export function loadSession(): PracticeSession | null;
export function loadSession(subject: Subject): PracticeSession | null;
export function loadSession(subject?: Subject): PracticeSession | null {
  const list = listInProgressSessions();
  if (!subject) return list[0] ?? null;
  return list.find((s) => s.subject === subject) ?? null;
}

/** 清空全部续做（可选按钮用） */
export function clearAllSessions() {
  writeStore({});
}