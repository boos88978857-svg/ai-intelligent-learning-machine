// app/practice/session/[id]/session-client.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../../../ui";
import { getSession, upsertSession, PracticeSession } from "../../../lib/session";

type Choice = { id: string; text: string; correct?: boolean };
type Question = {
  id: string;
  prompt: string;
  hints: string[]; // 可扩展多段提示
  choices: Choice[];
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function buildMockQuestion(subject: string, index: number): Question {
  // 这里只是示范题（你问 Apple/Blue 为何一样：是因为现在是 demo）
  if (subject === "英文") {
    return {
      id: `en-${index + 1}`,
      prompt: "Which one is a fruit?",
      hints: ["想想常見水果。", "常見水果：apple、banana、orange。", "排除非水果的物品。"],
      choices: [
        { id: "a", text: "Apple", correct: true },
        { id: "b", text: "Chair" },
        { id: "c", text: "Book" },
        { id: "d", text: "Shoe" },
      ],
    };
  }
  if (subject === "數學") {
    return {
      id: `ma-${index + 1}`,
      prompt: "小明有 12 顆糖，平均分給 3 個朋友，每人可以分到幾顆？",
      hints: ["想想除法。", "12 ÷ 3 = ?", "平均分就是除法。"],
      choices: [
        { id: "a", text: "3" },
        { id: "b", text: "4", correct: true },
        { id: "c", text: "5" },
        { id: "d", text: "6" },
      ],
    };
  }
  return {
    id: `ot-${index + 1}`,
    prompt: "（示範）太陽從哪裡升起？",
    hints: ["想想方位。", "太陽從東邊升起。", "答案是東方。"],
    choices: [
      { id: "a", text: "東方", correct: true },
      { id: "b", text: "西方" },
      { id: "c", text: "南方" },
      { id: "d", text: "北方" },
    ],
  };
}

export default function SessionClient({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [session, setSession] = useState<PracticeSession | null>(null);

  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [message, setMessage] = useState<string>("");
  const [hintText, setHintText] = useState<string>(""); // 当前提示卡内容
  const [hintIndexShown, setHintIndexShown] = useState<number>(0); // 已显示第几个提示（1..n）

  const currentQuestion = useMemo(() => {
    if (!session) return null;
    return buildMockQuestion(session.subject, session.currentIndex);
  }, [session]);

  // 读 session
  useEffect(() => {
    const s = getSession(sessionId);
    if (!s) {
      router.replace("/practice");
      return;
    }
    setSession(s);
  }, [router, sessionId]);

  // 计时
  useEffect(() => {
    if (!session || session.paused || session.status !== "in_progress") return;
    const timer = setInterval(() => {
      setSession((prev) => {
        if (!prev) return prev;
        const next = { ...prev, elapsedSec: prev.elapsedSec + 1 };
        upsertSession(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [session]);

  if (!session || !currentQuestion) return null;

  const paused = session.paused;

  function persist(next: PracticeSession) {
    setSession(next);
    upsertSession(next);
  }

  function togglePause() {
    persist({ ...session, paused: !session.paused });
  }

  function pick(choiceId: string) {
    if (paused) return;
    if (hasSubmitted) return;
    setSelectedChoiceId(choiceId);
    setMessage("");
  }

  function useHint() {
    if (paused) return;
    if (hasSubmitted && isCurrentCorrect()) return; // 已答对就不需要提示
    if (session.hintUsed >= session.hintLimit) {
      setMessage("提示次數已用完。");
      return;
    }

    // 扣次数
    const nextSession = { ...session, hintUsed: session.hintUsed + 1 };
    persist(nextSession);

    // 显示下一条提示（覆盖上一条）
    const nextIndex = Math.min(hintIndexShown + 1, currentQuestion.hints.length);
    setHintIndexShown(nextIndex);
    setHintText(currentQuestion.hints[nextIndex - 1] || currentQuestion.hints[0]);
    setMessage("");
  }

  function isCurrentCorrect() {
    if (!selectedChoiceId) return false;
    const picked = currentQuestion.choices.find((c) => c.id === selectedChoiceId);
    return !!picked?.correct;
  }

  function submit() {
    if (paused) return;

    if (!selectedChoiceId) {
      setMessage("請先選擇一個答案。");
      return;
    }

    const correct = isCurrentCorrect();
    setHasSubmitted(true);

    if (correct) {
      // ✅ 答对：加正确数、提示卡在进入下一题时消失
      const next = { ...session, correctCount: session.correctCount + 1 };
      persist(next);
      setMessage("答對了！請繼續下一題。");
      // 让文字“停留久一点”再进下一题
      setTimeout(() => {
        goNextAfterCorrect(next);
      }, 900);
    } else {
      // ✅ 答错：不跳题
      const next = { ...session, wrongCount: session.wrongCount + 1 };
      persist(next);
      setMessage("很可惜，這題沒有答對。你可以再試一次或使用提示。");
    }
  }

  function goNextAfterCorrect(s: PracticeSession) {
    // 清理本题状态
    setSelectedChoiceId(null);
    setHasSubmitted(false);
    setMessage("");
    setHintText(""); // ✅ 答对进入下一题，提示卡自动消失
    setHintIndexShown(0);

    const nextIndex = s.currentIndex + 1;

    // ✅ 回合结束：20题就结束
    if (nextIndex >= s.totalQuestions) {
      const done = { ...s, status: "done", currentIndex: s.totalQuestions - 1 };
      upsertSession(done);
      router.replace(`/practice/summary/${done.id}`);
      return;
    }

    const next = { ...s, currentIndex: nextIndex };
    persist(next);
  }

  // ❌ 下一题按钮：必须答对后才可点
  const nextDisabled = paused || !hasSubmitted || !isCurrentCorrect();

  // 样式：选择/对/错
  function choiceStyle(c: Choice) {
    let base = ui.choiceCard;
    if (selectedChoiceId === c.id) base = { ...base, ...ui.choiceSelected };
    if (hasSubmitted) {
      if (c.correct) base = { ...base, ...ui.choiceCorrect };
      if (selectedChoiceId === c.id && !c.correct) base = { ...base, ...ui.choiceWrong };
    }
    return base;
  }

  return (
    <main>
      <h1 style={{ margin: "0 0 12px", fontSize: 40, fontWeight: 900 }}>
        作答中
      </h1>

      {/* 状态区（固定同一行，不要跑版） */}
      <div style={ui.card}>
        <div style={ui.pillRow}>
          <div style={ui.pill}>科目：{session.subject}</div>
          <div style={ui.pill}>
            第 {session.currentIndex + 1} 題 / {session.totalQuestions}
          </div>
          <div style={ui.pill}>⏱ {formatTime(session.elapsedSec)}</div>
        </div>

        <div style={ui.btnRow}>
          <button style={ui.btn} onClick={togglePause}>
            {paused ? "▶ 繼續" : "⏸ 暫停"}
          </button>
          <button
            style={ui.btn}
            onClick={() => router.back()}
          >
            ← 回上一頁
          </button>
        </div>

        {/* 暂停提醒卡：只有“点了暂停”才出现 */}
        {paused ? (
          <div style={ui.notice}>
            <p style={ui.noticeTitle}>提醒</p>
            <p style={ui.noticeText}>已暫停。請點上方「▶ 繼續」後再操作。</p>
          </div>
        ) : null}
      </div>

      {/* 题目区（尽量保持一页） */}
      <div style={{ ...ui.card, marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <h2 style={{ ...ui.cardTitle, margin: 0 }}>題目</h2>
          {/* ✅ 右侧放对/错/提示，不显示多余“提示: 5/0”在标题区 */}
          <div style={ui.pillRow}>
            <div style={ui.pill}>對 {session.correctCount}</div>
            <div style={ui.pill}>錯 {session.wrongCount}</div>
            <div style={ui.pill}>提示 {session.hintUsed}/{session.hintLimit}</div>
          </div>
        </div>

        <p style={{ ...ui.cardDesc, marginTop: 10 }}>
          （示範） {currentQuestion.prompt}
        </p>

        {/* 选项 */}
        <div style={ui.choiceGrid}>
          {currentQuestion.choices.map((c) => (
            <div
              key={c.id}
              style={{
                ...choiceStyle(c),
                ...(paused ? { opacity: 0.55, cursor: "not-allowed" } : {}),
              }}
              onClick={() => pick(c.id)}
            >
              {c.text}
            </div>
          ))}
        </div>

        {/* 操作列 */}
        <div style={ui.btnRow}>
          <button
            style={{
              ...ui.btn,
              ...(paused || session.hintUsed >= session.hintLimit ? ui.btnDisabled : {}),
            }}
            onClick={useHint}
            disabled={paused || session.hintUsed >= session.hintLimit}
          >
            💡 提示（{session.hintUsed}/{session.hintLimit}）
          </button>

          <button
            style={{
              ...ui.btn,
              ...ui.btnPrimary,
              ...(paused ? ui.btnDisabled : {}),
            }}
            onClick={submit}
            disabled={paused}
          >
            ✅ 提交答案
          </button>

          <button
            style={{
              ...ui.btn,
              ...(nextDisabled ? ui.btnDisabled : {}),
            }}
            onClick={() => goNextAfterCorrect(session)}
            disabled={nextDisabled}
          >
            下一題 →
          </button>
        </div>

        {/* 提示卡：点提示后停留到答对进入下一题才消失；再次点提示会覆盖内容 */}
        {hintText ? (
          <div style={ui.notice}>
            <p style={ui.noticeTitle}>訊息</p>
            <p style={ui.noticeText}>
              （提示 {hintIndexShown}/{currentQuestion.hints.length}）{hintText}
            </p>
          </div>
        ) : null}

        {/* 反馈卡 */}
        {message ? (
          <div style={ui.notice}>
            <p style={ui.noticeTitle}>訊息</p>
            <p style={ui.noticeText}>{message}</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}