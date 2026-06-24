import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Clock, GraduationCap } from "lucide-react";
import {
  useGetExam,
  useSubmitExam,
  getListExamsQueryKey,
  getGetExamQueryKey,
  getGetDashboardQueryKey,
  getListAttemptsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionRunner } from "@/components/question-runner";
import { useToast } from "@/hooks/use-toast";

export default function ExamPage() {
  const [, params] = useRoute("/exams/:examId");
  const examId = Number(params?.examId);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useGetExam(examId);
  const submitExam = useSubmitExam();
  const [started, setStarted] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [examId, started]);

  useEffect(() => {
    setStarted(false);
    setSaveFailed(false);
  }, [examId]);

  if (query.isLoading) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }

  if (query.isError || !query.data) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center">
        Exam not found.{" "}
        <Link href="/exams" className="underline">
          Back to exams
        </Link>
      </div>
    );
  }

  const e = query.data;

  const handleSubmitted = async (result: {
    answers: { questionId: number; selectedIndex: number }[];
  }) => {
    try {
      await submitExam.mutateAsync({ examId, data: { answers: result.answers } });
      queryClient.invalidateQueries({ queryKey: getListExamsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetExamQueryKey(examId) });
      queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
      queryClient.invalidateQueries({ queryKey: getListAttemptsQueryKey() });
      setSaveFailed(false);
      toast({ title: "Exam submitted", description: "Your result was saved." });
    } catch {
      setSaveFailed(true);
      toast({ title: "Could not submit exam", variant: "destructive" });
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link
        href="/exams"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Exam prep
      </Link>

      <header className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{e.cert}</Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />~{e.timeLimitMinutes} min
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-bold">{e.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>{e.questions.length} questions</span>
          <span className="flex items-center gap-1">
            <GraduationCap className="h-3.5 w-3.5" />
            Passing score: {e.passPercentage}%
          </span>
        </div>
      </header>

      {!started ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="text-lg font-semibold">Ready to begin?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Answer every question, then submit to see your score and detailed
            explanations. Your best result feeds your certification readiness.
          </p>
          <Button size="lg" className="mt-5" onClick={() => setStarted(true)}>
            Begin exam
          </Button>
        </div>
      ) : (
        <QuestionRunner
          key={examId}
          questions={e.questions}
          passPercentage={e.passPercentage}
          submitLabel="Submit exam"
          submitting={submitExam.isPending}
          saveFailed={saveFailed}
          onSubmitted={handleSubmitted}
        />
      )}
    </div>
  );
}
