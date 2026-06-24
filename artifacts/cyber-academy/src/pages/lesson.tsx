import { useEffect, useState } from "react";
import { Link, useRoute, useLocation } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ListChecks,
} from "lucide-react";
import {
  useGetLesson,
  useSubmitQuiz,
  useCompleteLesson,
  getGetLessonQueryKey,
  getGetModuleQueryKey,
  getGetDashboardQueryKey,
  getListModulesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionRunner } from "@/components/question-runner";
import { useToast } from "@/hooks/use-toast";

export default function LessonPage() {
  const [, params] = useRoute("/lessons/:lessonId");
  const lessonId = Number(params?.lessonId);
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useGetLesson(lessonId);
  const submitQuiz = useSubmitQuiz();
  const completeLesson = useCompleteLesson();

  const [done, setDone] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDone(false);
    setSaveFailed(false);
  }, [lessonId]);

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-2/3 rounded" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center">
        Lesson not found.{" "}
        <Link href="/" className="underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const l = query.data;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGetLessonQueryKey(lessonId) });
    queryClient.invalidateQueries({
      queryKey: getGetModuleQueryKey(l.moduleId),
    });
    queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
    queryClient.invalidateQueries({ queryKey: getListModulesQueryKey() });
  };

  const handleQuizSubmitted = async (result: {
    answers: { questionId: number; selectedIndex: number }[];
  }) => {
    try {
      await submitQuiz.mutateAsync({
        lessonId,
        data: { answers: result.answers },
      });
      if (!l.completed) {
        await completeLesson.mutateAsync({
          lessonId,
          data: { completed: true },
        });
      }
      setDone(true);
      setSaveFailed(false);
      invalidate();
      toast({ title: "Progress saved", description: "Lesson marked complete." });
    } catch {
      setSaveFailed(true);
      toast({
        title: "Could not save progress",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMarkComplete = async () => {
    try {
      await completeLesson.mutateAsync({ lessonId, data: { completed: true } });
      setDone(true);
      invalidate();
      toast({ title: "Lesson complete" });
    } catch {
      toast({ title: "Could not save progress", variant: "destructive" });
    }
  };

  const hasQuestions = l.questions.length > 0;
  const completed = l.completed || done;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link
        href={`/modules/${l.moduleId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {l.modulePhase} · {l.moduleTitle}
      </Link>

      <header>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold sm:text-3xl">{l.title}</h1>
          {completed && (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          )}
        </div>
        <p className="mt-2 text-muted-foreground">{l.summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {l.estimatedMinutes} min read
          </span>
          {hasQuestions && (
            <span className="flex items-center gap-1">
              <ListChecks className="h-3.5 w-3.5" />
              {l.questions.length} knowledge check
              {l.questions.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </header>

      <article className="prose prose-invert max-w-none prose-headings:font-semibold prose-h2:mt-8 prose-h2:text-xl prose-h3:text-base prose-a:text-accent prose-strong:text-foreground prose-code:rounded prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:text-primary prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-primary prose-li:marker:text-muted-foreground">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{l.content}</ReactMarkdown>
      </article>

      {hasQuestions ? (
        <section className="border-t border-border pt-8">
          <div className="mb-5">
            <Badge variant="secondary" className="mb-2">
              Knowledge check
            </Badge>
            <h2 className="text-xl font-semibold">Test what you learned</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Answer all questions to complete this lesson. You'll see
              explanations after submitting.
            </p>
          </div>
          <QuestionRunner
            key={lessonId}
            questions={l.questions}
            passPercentage={70}
            submitLabel="Submit & complete lesson"
            submitting={submitQuiz.isPending || completeLesson.isPending}
            saveFailed={saveFailed}
            onSubmitted={handleQuizSubmitted}
          />
        </section>
      ) : (
        !completed && (
          <div className="border-t border-border pt-6">
            <Button
              onClick={handleMarkComplete}
              disabled={completeLesson.isPending}
            >
              Mark as complete
            </Button>
          </div>
        )
      )}

      <nav className="flex items-center justify-between gap-3 border-t border-border pt-6">
        {l.prevLessonId != null ? (
          <Button
            variant="outline"
            onClick={() => navigate(`/lessons/${l.prevLessonId}`)}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
        ) : (
          <span />
        )}
        {l.nextLessonId != null ? (
          <Button onClick={() => navigate(`/lessons/${l.nextLessonId}`)}>
            Next lesson
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => navigate(`/modules/${l.moduleId}`)}>
            Finish phase
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </nav>
    </div>
  );
}
