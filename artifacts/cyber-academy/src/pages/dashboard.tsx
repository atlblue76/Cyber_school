import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Trophy,
} from "lucide-react";
import {
  useGetDashboard,
  useListModules,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getIcon } from "@/lib/icons";
import { timeAgo } from "@/lib/format";

export default function Dashboard() {
  const dashboard = useGetDashboard();
  const modules = useListModules();

  if (dashboard.isLoading || modules.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-44 w-full rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (dashboard.isError || modules.isError || !dashboard.data || !modules.data) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center">
        Failed to load your dashboard. Make sure the API server is running.
      </div>
    );
  }

  const d = dashboard.data;

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-xl border border-border bg-gradient-to-br from-secondary/60 via-card to-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
              Northwind Robotics · Security Program
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              {d.completedLessons === 0
                ? "Your first day on the job starts now"
                : "Welcome back, security engineer"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Current phase:{" "}
              <span className="text-foreground">{d.currentPhaseTitle}</span>
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {d.nextLessonId != null && (
                <Link href={`/lessons/${d.nextLessonId}`}>
                  <Button size="lg">
                    {d.completedLessons === 0 ? "Start the course" : "Continue learning"}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Link href="/exams">
                <Button size="lg" variant="outline">
                  <GraduationCap className="mr-1 h-4 w-4" />
                  Exam prep
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full max-w-xs shrink-0 rounded-lg border border-border bg-background/40 p-5">
            <div className="flex items-end justify-between">
              <span className="text-sm text-muted-foreground">
                Overall progress
              </span>
              <span className="font-mono text-2xl font-bold text-primary">
                {d.overallProgressPct}%
              </span>
            </div>
            <Progress value={d.overallProgressPct} className="mt-3 h-2" />
            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <Stat
                label="Lessons"
                value={`${d.completedLessons}/${d.totalLessons}`}
                icon={<BookOpen className="h-4 w-4" />}
              />
              <Stat
                label="Phases"
                value={`${d.completedModules}/${d.totalModules}`}
                icon={<CheckCircle2 className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>
      </section>

      {d.certReadiness.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">Certification readiness</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {d.certReadiness.map((c) => (
              <div
                key={c.cert}
                className="rounded-lg border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-accent" />
                    <span className="font-semibold">CompTIA {c.cert}</span>
                  </div>
                  <span className="font-mono text-lg font-bold">
                    {c.readinessPct}%
                  </span>
                </div>
                <Progress value={c.readinessPct} className="mt-3 h-2" />
                <div className="mt-3 text-xs text-muted-foreground">
                  {c.bestExamPct != null
                    ? `Best practice exam: ${c.bestExamPct}% · ${c.examsTaken} attempt${c.examsTaken === 1 ? "" : "s"}`
                    : "No practice exam taken yet"}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Company-building phases</h2>
          <span className="text-xs text-muted-foreground">
            {modules.data.length} modules
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.data.map((m) => {
            const Icon = getIcon(m.icon);
            return (
              <Link key={m.id} href={`/modules/${m.id}`}>
                <div className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50">
                  <div className="mb-3 flex items-center justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: `${m.accentColor}1a`,
                        color: m.accentColor,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {m.phase}
                    </span>
                  </div>
                  <h3 className="font-semibold leading-snug">{m.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {m.subtitle}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.certTags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-auto pt-4">
                    <div className="mb-1.5 flex justify-between text-[11px] text-muted-foreground">
                      <span>
                        {m.completedLessons}/{m.lessonCount} lessons
                      </span>
                      <span>{m.progressPct}%</span>
                    </div>
                    <Progress value={m.progressPct} className="h-1.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {d.recentAttempts.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">Recent activity</h2>
          <div className="divide-y divide-border rounded-lg border border-border bg-card">
            {d.recentAttempts.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <Trophy
                    className={
                      a.passed
                        ? "h-4 w-4 text-primary"
                        : "h-4 w-4 text-muted-foreground"
                    }
                  />
                  <div>
                    <div className="text-sm font-medium">{a.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {a.kind === "exam" ? "Practice exam" : "Lesson quiz"} ·{" "}
                      {timeAgo(a.createdAt)}
                    </div>
                  </div>
                </div>
                <Badge variant={a.passed ? "default" : "secondary"}>
                  {a.percentage}%
                </Badge>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-md bg-secondary/50 p-2.5">
      <div className="flex items-center justify-center gap-1 text-muted-foreground">
        {icon}
      </div>
      <div className="mt-1 font-mono text-sm font-semibold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
