import { Activity, BookOpen, GraduationCap, Trophy } from "lucide-react";
import { useListAttempts } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { timeAgo } from "@/lib/format";

export default function ProgressPage() {
  const query = useListAttempts();

  return (
    <div className="space-y-8">
      <header>
        <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary">
          <Activity className="h-4 w-4" />
          Track record
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">Your progress</h1>
        <p className="mt-2 text-muted-foreground">
          Every quiz and practice exam you've taken, newest first.
        </p>
      </header>

      {query.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : query.isError || !query.data ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center">
          Failed to load your activity.
        </div>
      ) : query.data.length === 0 ? (
        <Empty className="rounded-xl border border-border bg-card py-16">
          <Trophy className="mb-3 h-8 w-8 text-muted-foreground" />
          <div className="font-medium">No attempts yet</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete a lesson quiz or practice exam to start your track record.
          </p>
        </Empty>
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {query.data.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={
                    a.kind === "exam"
                      ? "flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent"
                      : "flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground"
                  }
                >
                  {a.kind === "exam" ? (
                    <GraduationCap className="h-4 w-4" />
                  ) : (
                    <BookOpen className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.kind === "exam" ? "Practice exam" : "Lesson quiz"} ·{" "}
                    {a.score}/{a.total} correct · {timeAgo(a.createdAt)}
                  </div>
                </div>
              </div>
              <Badge variant={a.passed ? "default" : "secondary"}>
                {a.percentage}%
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
