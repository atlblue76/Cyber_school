# CyberBuild Academy

An interactive cybersecurity course where the learner role-plays standing up the IT/security program for a fictional new company (Northwind Robotics). Modules are company-building phases plus CompTIA Security+ and CySA+ exam prep.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/cyber-academy run dev` — run the web frontend
- `pnpm --filter @workspace/scripts run seed-academy` — (re)seed all course content (idempotent; resets identities)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- Frontend: React + Vite, wouter (routing), TanStack Query, react-markdown + remark-gfm, Tailwind + shadcn/ui
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- DB schema (source of truth): `lib/db/src/schema/*.ts` — modules, lessons, questions, exams, examQuestions, lessonProgress, attempts
- API contract: OpenAPI spec in `lib/api-spec`; generated hooks/schemas in `@workspace/api-client-react` and `@workspace/api-zod`
- API route handlers: `artifacts/api-server/src/routes/*.ts` (dashboard, modules, lessons, quizzes, exams, attempts), mounted in `routes/index.ts`
- Progress/stats helpers: `artifacts/api-server/src/lib/progress.ts`
- Seed content: `scripts/src/seed-academy.ts`
- Frontend pages: `artifacts/cyber-academy/src/pages/*.tsx` (dashboard, module, lesson, exams, exam, progress)
- Shared frontend pieces: `components/layout.tsx`, `components/question-runner.tsx`, `lib/icons.tsx`, `lib/format.ts`
- Theme: `artifacts/cyber-academy/src/index.css` (cyberpunk dark — neon green primary, neon blue accent)

## Architecture decisions

- No auth: single global learner. Progress and attempts are global, not per-user.
- Instant client-side grading: lesson/exam GET responses include `correctIndex` + `explanation` so `QuestionRunner` grades immediately without a server round-trip; the submit mutation then records the attempt and (for lessons) marks completion. This is an intentional self-study UX tradeoff, acceptable because there are no other users or stakes.
- `QuestionRunner` is reused for both lesson knowledge checks and full exams; it is keyed by `lessonId`/`examId` so internal state remounts on navigation. A `saveFailed` prop drives a retry path if the recording mutation fails.
- Seed is idempotent: it `TRUNCATE ... RESTART IDENTITY` so re-running keeps IDs starting at 1.

## Product

- Dashboard: overall progress, certification readiness (Security+ / CySA+), and the company-building phases (modules).
- Module pages list lessons; lesson pages render markdown content plus an inline knowledge-check quiz.
- Exam prep: timed practice exams (Security+ and CySA+) with scoring, pass thresholds, and explanations.
- Progress page summarizes completion and recent attempts.

## User preferences

- No emojis in the UI.

## Gotchas

- Re-seeding resets all progress/attempts and restarts IDs at 1 (via TRUNCATE RESTART IDENTITY). Bookmarked numeric IDs survive because IDs are deterministic.
- The `scripts` package needs `drizzle-orm` as a direct dependency to use `sql` in the seed.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
