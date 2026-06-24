import { Link, useRoute } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Target,
} from "lucide-react";
import { useGetModule } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/icons";

export default function ModulePage() {
  const [, params] = useRoute("/modules/:moduleId");
  const moduleId = Number(params?.moduleId);
  const query = useGetModule(moduleId);

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center">
        Module not found.{" "}
        <Link href="/" className="underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const m = query.data;
  const Icon = getIcon(m.icon);
  const firstIncomplete = m.lessons.find((l) => !l.completed) ?? m.lessons[0];

  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </Link>

      <section className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${m.accentColor}1a`,
              color: m.accentColor,
            }}
          >
            <Icon className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {m.phase}
            </div>
            <h1 className="mt-1 text-2xl font-bold">{m.title}</h1>
            <p className="mt-1 text-muted-foreground">{m.subtitle}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {m.certTags.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                ~{m.estimatedHours}h
              </span>
            </div>
          </div>
        </div>

        <div
          className="mt-6 rounded-lg border-l-2 bg-secondary/40 p-4 text-sm leading-relaxed text-muted-foreground"
          style={{ borderColor: m.accentColor }}
        >
          <span className="font-semibold text-foreground">Your mission: </span>
          {m.scenario}
        </div>

        {m.objectives.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Target className="h-4 w-4 text-accent" />
              What you'll be able to do
            </div>
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {m.objectives.map((o, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <Progress value={m.progressPct} className="h-2" />
          </div>
          {firstIncomplete && (
            <Link href={`/lessons/${firstIncomplete.id}`}>
              <Button>
                {m.progressPct === 0 ? "Start phase" : "Continue"}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Lessons</h2>
        <div className="space-y-3">
          {m.lessons.map((l, i) => (
            <Link key={l.id} href={`/lessons/${l.id}`}>
              <div className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50">
                {l.completed ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-medium">{l.title}</span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {l.summary}
                  </p>
                </div>
                <div className="hidden shrink-0 items-center gap-3 text-xs text-muted-foreground sm:flex">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {l.estimatedMinutes}m
                  </span>
                  <span>{l.questionCount} Q</span>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
