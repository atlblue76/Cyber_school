import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import modulesRouter from "./modules";
import lessonsRouter from "./lessons";
import quizzesRouter from "./quizzes";
import examsRouter from "./exams";
import attemptsRouter from "./attempts";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(modulesRouter);
router.use(lessonsRouter);
router.use(quizzesRouter);
router.use(examsRouter);
router.use(attemptsRouter);

export default router;
