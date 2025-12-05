'use client';

import { Quiz } from '@/data/student/course-content';
import { QuizQuestion } from './quiz-question';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface QuizResultsProps {
  quiz: Quiz;
}

export const QuizResults = ({ quiz }: QuizResultsProps) => {
  const submission = quiz.submission;

  if (!submission) {
    return null;
  }

  const score = submission.score;
  const passed = submission.passed;
  const totalQuestions = quiz.questions?.length || 0;
  const correctAnswers = quiz.questions?.filter((q) => q.isCorrect).length || 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Results Summary */}
      <Card className={cn('border-2', passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50')}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Quiz Completed</p>
            </div>
            {passed ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
                <span className="text-sm font-semibold text-green-600">Passed</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <XCircle className="w-12 h-12 text-red-600" />
                <span className="text-sm font-semibold text-red-600">Not Passed</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <span className="text-sm font-medium">Your Score</span>
              <span className="text-3xl font-bold">{score.toFixed(1)}%</span>
            </div>
            <Progress value={score} className="h-3" />
            {quiz.passingScore && (
              <p className="text-xs text-muted-foreground">
                Passing Score: {quiz.passingScore}%
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
            <div>
              <p className="text-muted-foreground text-xs uppercase">Correct Answers</p>
              <p className="text-2xl font-bold text-green-600">{correctAnswers}/{totalQuestions}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase">Points Earned</p>
              <p className="text-2xl font-bold">
                {quiz.questions.reduce((sum, q) => sum + (q.earnedPoints || 0), 0)} / {quiz.totalPoints}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase">Time Taken</p>
              <p className="text-2xl font-bold font-mono">{formatTime(submission.timeTaken)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase">Completed</p>
              <p className="text-sm font-medium">{formatDate(submission.submittedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Review */}
      {quiz.showCorrectAnswers && quiz.questions && quiz.questions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Review Your Answers
          </h2>
          {quiz.questions.map((question) => (
            <QuizQuestion
              key={question.questionId}
              question={question}
              selectedAnswer={question.userAnswer}
              onAnswerChange={() => {}}
              isReviewMode={true}
            />
          ))}
        </div>
      )}

      {/* No Review Available */}
      {!quiz.showCorrectAnswers && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Detailed answer review is not available for this quiz. Contact your instructor if you have questions about your score.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
