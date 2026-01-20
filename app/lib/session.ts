// app/lib/session.ts
export type Subject = "英文" | "數學" | "其他";

export type PracticeSession = {
  id: string;
  subject: Subject;

  totalQuestions: number; // 固定 20
  currentIndex: number; // 0-based
  elapsedSec: number;

  paused: boolean;

  correctCount: number;
  wrongCount: number;

  hintLimit: number; // 固定 5
  hintUsed: number;

  stage?: string;

  createdAt: number;
  updatedAt: number;
};

const LS_KEY = "ai_learning_sessions_v1";

type SessionMap = Record<string, PracticeSession>; // key = subject

function safeParse(json: string | null): SessionMap {
  if (!json) return {};
  try {
    const obj = JSON.parse(json);
    if (!obj || typeof obj !== "object") return {};
    return obj as SessionMap;
  } catch {
    return {};
  }
}

function readAll(): SessionMap {
  if (typeof window === "undefined") return {};
  return safeParse(window.localStorage.getItem(LS_KEY));
}

function writeAll(map: SessionMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(map));
}

export function newSession(subject: Subject, stage?: string): PracticeSession {
  const now = Date.now();
  return {
    id: `${subject}-${now}`,
    subject,

    totalQuestions: 20,
    currentIndex: 0,
    elapsedSec: 0,

    paused: false,

    correctCount: 0,
    wrongCount: 0,

    hintLimit: 5,
    hintUsed: 0,

    stage,

    createdAt: now,
    updatedAt: now,
  };
}

export function loadSession(subject: Subject): PracticeSession | null {
  const map = readAll();
  return map[subject] ?? null;
}

export function saveSession(session: PracticeSession) {
  const map = readAll();
  map[session.subject] = { ...session, updatedAt: Date.now() };
  writeAll(map);
}

/** ✅ 兼容你现有 session-client.tsx 的 import：upsertSession */
export const upsertSession = saveSession;

export function removeSession(subject: Subject) {
  const map = readAll();
  delete map[subject];
  writeAll(map);
}

export function loadAllSessions(): PracticeSession[] {
  const map = readAll();
  return Object.values(map).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function clearAllSessions() {
  writeAll({});
}