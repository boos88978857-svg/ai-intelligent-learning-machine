// app/lib/session.ts
export type Subject = "英文" | "數學" | "其他學科" | "學習競技場" | string;

export type PracticeSession = {
  id: string;
  subject: Subject;
  totalQuestions: number;
  currentIndex: number; // 0-based
  elapsedSec: number;
  paused: boolean;

  correctCount: number;
  wrongCount: number;

  hintUsed: number;
  hintLimit: number;

  // 你后续题库会替换，这里先保留扩展空间
  meta?: Record<string, any>;
};

const STORAGE_KEY = "aim:sessions:v1";

type SessionMap = Record<string, PracticeSession>;

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function readMap(): SessionMap {
  if (typeof window === "undefined") return {};
  const map = safeParse<SessionMap>(localStorage.getItem(STORAGE_KEY));
  return map && typeof map === "object" ? map : {};
}

function writeMap(map: SessionMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

/** 读全部进行中的 session（给学习区用） */
export function loadAllSessions(): PracticeSession[] {
  const map = readMap();
  return Object.values(map).sort((a, b) => (a.subject > b.subject ? 1 : -1));
}

/**
 * 读某科目的 session
 * - 允许你写 loadSession("英文")
 * - 也允许旧代码不带参数：loadSession() -> 回传任意一个（优先第一个）
 */
export function loadSession(subject?: Subject): PracticeSession | null {
  const map = readMap();
  if (subject) return map[String(subject)] ?? null;
  const all = Object.values(map);
  return all.length ? all[0] : null;
}

/** 保存/更新某科目的 session */
export function saveSession(session: PracticeSession) {
  const map = readMap();
  map[String(session.subject)] = session;
  writeMap(map);
}

/** 清除某科目的 session */
export function clearSession(subject: Subject) {
  const map = readMap();
  delete map[String(subject)];
  writeMap(map);
}

/** 建立新回合（注意：学习区不提供“新回合”，只在入口页点开始才会用到） */
export function newSession(subject: Subject, opts?: { totalQuestions?: number; hintLimit?: number }): PracticeSession {
  const totalQuestions = opts?.totalQuestions ?? 20;
  const hintLimit = opts?.hintLimit ?? 5;

  return {
    id: `${String(subject)}-${Date.now()}`,
    subject,
    totalQuestions,
    currentIndex: 0,
    elapsedSec: 0,
    paused: false,
    correctCount: 0,
    wrongCount: 0,
    hintUsed: 0,
    hintLimit,
  };
}