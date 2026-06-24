import { useState } from "react";
import { Check, X, CircleHelp } from "lucide-react";
import type { Question } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type RunnerResult = {
  answers: { questionId: number; selectedIndex: number }[];
  score: number;
  total: number;
  percentage: number;
};

type Props = {
  questions: Question[];
  passPercentage: number;
  submitLabel?: string;
  onSubmitted: (result: RunnerResult) => void;
  submitting?: boolean;
  saveFailed?: boolean;
};

export function QuestionRunner({
  questions,
  passPercentage,
  submitLabel = "Submit answers",
  onSubmitted,
  submitting = false,
  saveFailed = false,
}: Props) {
  const [selections, setSelections] = useState<Record<number, number>>({});
  const [graded, setGraded] = useState(false);

  const allAnswered = questions.every((q) => selections[q.id] !== undefined);

  const score = questions.filter(
    (q) => selections[q.id] === q.correctIndex,
  ).length;
  const percentage =
    questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const passed = percentage >= passPercentage;

  const buildResult = (): RunnerResult => ({
    answers: questions.map((q) => ({
      questionId: q.id,
      selectedIndex: selections[q.id] ?? -1,
    })),
    score,
    total: questions.length,
    percentage,
  });

  const handleGrade = () => {
    setGraded(true);
    onSubmitted(buildResult());
  };

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => {
        const selected = selections[q.id];
        return (
          <div
            key={q.id}
            className="rounded-lg border border-border bg-card p-5"
          >
            <div className="mb-4 flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-muted-foreground">
                {qi + 1}
              </span>
              <p className="font-medium leading-relaxed">{q.prompt}</p>
            </div>

            <div className="space-y-2 pl-9">
              {q.options.map((opt, oi) => {
                const isSelected = selected === oi;
                const isCorrect = oi === q.correctIndex;
                const showCorrect = graded && isCorrect;
                const showWrong = graded && isSelected && !isCorrect;

                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={graded}
                    onClick={() =>
                      setSelections((prev) => ({ ...prev, [q.id]: oi }))
                    }
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors",
                      !graded &&
                        isSelected &&
                        "border-primary bg-primary/10 text-foreground",
                      !graded &&
                        !isSelected &&
                        "border-border hover:border-muted-foreground/40 hover:bg-secondary/50",
                      showCorrect && "border-primary bg-primary/15 text-foreground",
                      showWrong &&
                        "border-destructive bg-destructive/15 text-foreground",
                      graded &&
                        !showCorrect &&
                        !showWrong &&
                        "border-border opacity-60",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                        !graded && isSelected
                          ? "border-primary text-primary"
                          : "border-muted-foreground/40 text-muted-foreground",
                        showCorrect && "border-primary text-primary",
                        showWrong && "border-destructive text-destructive",
                      )}
                    >
                      {showCorrect ? (
                        <Check className="h-3 w-3" />
                      ) : showWrong ? (
                        <X className="h-3 w-3" />
                      ) : (
                        String.fromCharCode(65 + oi)
                      )}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {graded && (
              <div className="ml-9 mt-3 flex items-start gap-2 rounded-md bg-secondary/50 p-3 text-sm text-muted-foreground">
                <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{q.explanation}</span>
              </div>
            )}
          </div>
        );
      })}

      {!graded ? (
        <Button
          size="lg"
          disabled={!allAnswered || submitting}
          onClick={handleGrade}
          className="w-full sm:w-auto"
        >
          {submitting ? "Submitting..." : submitLabel}
        </Button>
      ) : (
        <div className="space-y-3">
          <div
            className={cn(
              "rounded-lg border p-5 text-center",
              passed
                ? "border-primary/40 bg-primary/10"
                : "border-destructive/40 bg-destructive/10",
            )}
          >
            <div className="text-3xl font-bold">{percentage}%</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {score} of {questions.length} correct ·{" "}
              {passed ? "Passed" : `Need ${passPercentage}% to pass`}
            </div>
          </div>
          {saveFailed && (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Your result was graded but could not be saved.
              </p>
              <Button
                variant="outline"
                disabled={submitting}
                onClick={() => onSubmitted(buildResult())}
              >
                {submitting ? "Saving..." : "Retry save"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
