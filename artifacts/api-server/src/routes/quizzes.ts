import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { lessonsTable, questionsTable, attemptsTable } from "@workspace/db";
import {
  SubmitQuizParams,
  SubmitQuizBody,
  SubmitQuizResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/quizzes/:lessonId/submit", async (req, res): Promise<void> => {
  const params = SubmitQuizParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = SubmitQuizBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [lesson] = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.id, params.data.lessonId));

  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  const questions = (
    await db
      .select()
      .from(questionsTable)
      .where(eq(questionsTable.lessonId, lesson.id))
  ).sort((a, b) => a.order - b.order);

  const answerMap = new Map<number, number>();
  for (const a of body.data.answers) {
    answerMap.set(a.questionId, a.selectedIndex);
  }

  const answers = questions.map((q) => {
    const selectedIndex = answerMap.get(q.id) ?? -1;
    return {
      questionId: q.id,
      selectedIndex,
      correctIndex: q.correctIndex,
      isCorrect: selectedIndex === q.correctIndex,
      explanation: q.explanation,
    };
  });

  const score = answers.filter((a) => a.isCorrect).length;
  const total = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = percentage >= 70;

  const [attempt] = await db
    .insert(attemptsTable)
    .values({
      kind: "quiz",
      refId: lesson.id,
      title: lesson.title,
      score,
      total,
      percentage,
      passed,
    })
    .returning();

  res.json(
    SubmitQuizResponse.parse({
      id: attempt.id,
      kind: "quiz",
      refId: lesson.id,
      title: lesson.title,
      score,
      total,
      percentage,
      passed,
      answers,
    }),
  );
});

export default router;
