// app/lib/question.ts
// 題目規格（Question Schema）
// 這是整個作答系統的核心定義，之後所有題型都會吃這個結構

export type QuestionType =
  | "choice"        // 選擇題
  | "fill"          // 填空題
  | "application"   // 應用題（數學）
  | "listening";    // 聽力題

export interface Question {
  id: string;

  subject: "英文" | "數學";
  type: QuestionType;

  // 題目本體
  prompt: string;

  // 選擇題用
  options?: string[];

  // 正確答案（目前先不用，之後判斷用）
  answer?: string | number;

  // 提示文字（可選）
  hint?: string;

  // 是否需要輔助工具
  tools?: {
    whiteboard?: boolean; // 涂鴉板
    abacus?: boolean;     // 算盤
  };
}