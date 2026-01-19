// app/lib/question.ts

export type Subject = "英文" | "數學" | "其他";

export type QuestionType = "choice" | "fill" | "application";

export type QuestionTools = {
  whiteboard?: boolean; // 塗鴉白板
  abacus?: boolean;     // 算盤
};

export type ChoiceOption = {
  id: string;
  text: string;
};

export type Question =
  | {
      id: string;
      subject: Subject;
      type: "choice";
      prompt: string;
      hint?: string;
      tools?: QuestionTools;
      options: ChoiceOption[];
      answerId: string; // 正確選項 id
    }
  | {
      id: string;
      subject: Subject;
      type: "fill";
      prompt: string;
      hint?: string;
      tools?: QuestionTools;
      answerText: string; // 正確答案（先用字串，之後可進階成多答案/正則）
    }
  | {
      id: string;
      subject: Subject;
      type: "application";
      prompt: string;
      hint?: string;
      tools?: QuestionTools;
      answerText: string; // 應用題先用「參考答案」字串（之後可改成步驟/評分）
    };

// 先做「示範題庫」，之後你會換成真正題庫/後端
export function getMockQuestion(subject: Subject): Question {
  if (subject === "英文") {
    return {
      id: "en-demo-1",
      subject: "英文",
      type: "choice",
      prompt: "（示範）Which one is a fruit?",
      hint: "想想常見水果",
      tools: { whiteboard: false, abacus: false },
      options: [
        { id: "a", text: "Apple" },
        { id: "b", text: "Chair" },
        { id: "c", text: "Book" },
        { id: "d", text: "Shoe" },
      ],
      answerId: "a",
    };
  }

  if (subject === "數學") {
    return {
      id: "math-demo-1",
      subject: "數學",
      type: "application",
      prompt: "（示範）小明有 12 顆糖，平均分給 3 個朋友，每人可以分到幾顆？",
      hint: "想想除法",
      tools: { whiteboard: true, abacus: true },
      answerText: "12 ÷ 3 = 4（每人 4 顆）",
    };
  }

  // 其他學科先給填空示範
  return {
    id: "other-demo-1",
    subject: "其他",
    type: "fill",
    prompt: "（示範）台灣的首都是哪裡？",
    hint: "兩個字",
    tools: { whiteboard: false, abacus: false },
    answerText: "台北",
  };
}