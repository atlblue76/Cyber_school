import { Link } from "wouter";
import { ArrowRight, GraduationCap, Clock, Trophy } from "lucide-react";
import { useListExams } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getIcon } from "@/lib/icons";

export default function ExamsPage() {
  const query = useListExams();

  return (
    <div className="space-y-8">
      <header>
        <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary">
          <GraduationCap className="h-4 w-4" />
          Certification track
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">Exam preparation</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Timed practice exams that mirror the real CompTIA Security+ and CySA+
          tests. Work through the company-building phases first, then prove your
          readiness here.
        </p>
      </header>

      {query.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : query.isError || !query.data ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center">
          Failed to load exams.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {query.data.map((e) => {
            const Icon = getIcon(e.icon);
            return (
              <div
                key={e.id}
                className="flex flex-col rounded-xl border border-border bg-card p-6"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `${e.accentColor}1a`,
                      color: e.accentColor,
                    }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary">{e.cert}</Badge>
                </div>
                <h2 className="font-semibold">{e.title}</h2>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">
                  {e.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>{e.questionCount} questions</span>
                  <span className="flex items-center gap-1">
                    <Trophy className="h-3.5 w-3.5" />
                    Pass at {e.passPercentage}%
                  </span>
                  {e.bestPercentage != null && (
                    <span className="text-primary">
                      Best: {e.bestPercentage}%
                    </span>
                  )}
                </div>

                <Link href={`/exams/${e.id}`} className="mt-5">
                  <Button className="w-full">
                    {e.attemptsTaken > 0 ? "Retake exam" : "Start exam"}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
