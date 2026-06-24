import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db } from "@workspace/db";
import { attemptsTable } from "@workspace/db";
import { ListAttemptsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/attempts", async (_req, res): Promise<void> => {
  const attempts = await db
    .select()
    .from(attemptsTable)
    .orderBy(desc(attemptsTable.createdAt));

  const payload = attempts.map((a) => ({
    id: a.id,
    kind: a.kind,
    refId: a.refId,
    title: a.title,
    score: a.score,
    total: a.total,
    percentage: a.percentage,
    passed: a.passed,
    createdAt: a.createdAt.toISOString(),
  }));

  res.json(ListAttemptsResponse.parse(payload));
});

export default router;
