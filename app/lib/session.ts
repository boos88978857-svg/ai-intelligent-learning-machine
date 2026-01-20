// app/lib/session.ts
"use client";

export type Subject = "英文" | "數學" | "其他";

export type QuestionType = "choice" | "application";

export type Choice = {
  id: string;
  text: string;
  correct?: boolean;
};

export type Question = {
  id: string;
  subject: Subject;
  type: QuestionType;
  prompt: string;
  hint?: string;
  choices?: Choice[]; // choice 題才需要
};

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

  // 作答狀態（每題）
  selectedChoiceId?: string;
  hasSubmitted?: boolean;
};

type SessionsMap = Record<string, PracticeSession>;

const KEY_SESSIONS = "ilm:sessions:v1";
const KEY_ACTIVE_BY_SUBJECT = "ilm:activeBySubject:v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function nowId() {
  // 夠用就好：時間 + 隨機
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/** 讀取全部 sessions */
export function loadAllSessions(): SessionsMap {
  if (typeof window === "undefined") return {};
  return safeParse<SessionsMap>(localStorage.getItem(KEY_SESSIONS), {});
}

/** 覆寫全部 sessions */
export function saveAllSessions(map: SessionsMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_SESSIONS, JSON.stringify(map));
}

/** 取得單一 session */
export function getSession(sessionId: string): PracticeSession | null {
  const all = loadAllSessions();
  return all[sessionId] ?? null;
}

/** 新增/更新 session */
export function upsertSession(s: PracticeSession) {
  const all = loadAllSessions();
  all[s.id] = s;
  saveAllSessions(all);
}

/** 移除 session */
export function removeSession(sessionId: string) {
  const all = loadAllSessions();
  delete all[sessionId];
  saveAllSessions(all);

  // 同步清掉 active 指向
  const active = loadActiveBySubject();
  (Object.keys(active) as Subject[]).forEach((sub) => {
    if (active[sub] === sessionId) {
      delete active[sub];
    }
  });
  saveActiveBySubject(active);
}

/** 依 subject 列出未完成 session（只要 currentIndex < totalQuestions） */
export function listUnfinishedBySubject(subject: Subject): PracticeSession[] {
  const all = loadAllSessions();
  return Object.values(all).filter(
    (s) => s.subject === subject && s.currentIndex < s.totalQuestions
  );
}

/** 列出所有未完成 session */
export function listAllUnfinished(): PracticeSession[] {
  const all = loadAllSessions();
  return Object.values(all).filter((s) => s.currentIndex < s.totalQuestions);
}

/** activeBySubject */
type ActiveBySubject = Partial<Record<Subject, string>>;

function loadActiveBySubject(): ActiveBySubject {
  if (typeof window === "undefined") return {};
  return safeParse<ActiveBySubject>(localStorage.getItem(KEY_ACTIVE_BY_SUBJECT), {});
}

function saveActiveBySubject(map: ActiveBySubject) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_ACTIVE_BY_SUBJECT, JSON.stringify(map));
}

export function setActiveSessionId(subject: Subject, sessionId: string) {
  const map = loadActiveBySubject();
  map[subject] = sessionId;
  saveActiveBySubject(map);
}

export function getActiveSessionId(subject: Subject): string | null {
  const map = loadActiveBySubject();
  return map[subject] ?? null;
}

/** 建新回合（從「科目入口頁」觸發，學習區不提供新回合入口） */
export function newSession(subject: Subject): PracticeSession {
  return {
    id: nowId(),
    subject,
    totalQuestions: 20,
    currentIndex: 0,
    elapsedSec: 0,
    paused: false,
    correctCount: 0,
    wrongCount: 0,
    hintLimit: 5,
    hintUsed: 0,
  };
}