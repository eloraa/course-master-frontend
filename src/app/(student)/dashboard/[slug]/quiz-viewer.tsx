'use client';

import { useState, useEffect } from 'react';
import { Quiz } from '@/data/student/course-content';
import { QuizQuestion } from './quiz-question';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface QuizViewerProps {
  quiz: Quiz;
  courseId: string;
  onSubmit: (answers: Record<string, string>, timeTaken: number) => Promise<void>;
  isSubmitting: boolean;
}

export const QuizViewer = ({ quiz, courseId, onSubmit, isSubmitting }: QuizViewerProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    // Show warning when time limit is 5 minutes away
    if (quiz.timeLimit && timeElapsed > quiz.timeLimit * 60 - 300) {
      setShowWarning(true);
    }

    return () => clearInterval(interval);
  }, [quiz.timeLimit, timeElapsed]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitClick = () => {
    if (Object.keys(answers).length === 0) {
      alert('Please answer at least one question before submitting.');
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    await onSubmit(answers, timeElapsed);
  };

  const answeredQuestions = Object.keys(answers).length;
  const totalQuestions = quiz.questions?.length || 0;
  const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {quiz.description && <p className="text-sm text-muted-foreground">{quiz.description}</p>}
          {quiz.instructions && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{quiz.instructions}</AlertDescription>
            </Alert>
          )}

          {/* Quiz Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Questions</p>
              <p className="font-semibold">{totalQuestions}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Points</p>
              <p className="font-semibold">{quiz.totalPoints}</p>
            </div>
            {quiz.passingScore && (
              <div>
                <p className="text-muted-foreground">Passing Score</p>
                <p className="font-semibold">{quiz.passingScore}%</p>
              </div>
            )}
            {quiz.timeLimit && (
              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Time Limit
                </p>
                <p className="font-semibold">{quiz.timeLimit} min</p>
              </div>
            )}
          </div>

          {/* Time Elapsed */}
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">Time Elapsed</p>
            <p className="text-2xl font-bold font-mono">{formatTime(timeElapsed)}</p>
          </div>

          {/* Progress */}
          <div className="pt-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Progress</p>
              <p className="text-sm text-muted-foreground">
                {answeredQuestions} / {totalQuestions}
              </p>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Time Warning */}
          {showWarning && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Time limit is running out! Hurry up and submit your answers.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Questions */}
      {quiz.questions && quiz.questions.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-6">Questions</h2>
          {quiz.questions.map((question, index) => (
            <QuizQuestion key={question.questionId} question={question} selectedAnswer={answers[question.questionId]} onAnswerChange={handleAnswerChange} isReviewMode={false} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center py-12 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">No questions available for this quiz</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button onClick={handleSubmitClick} disabled={isSubmitting || answeredQuestions === 0} size="lg">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="md:max-w-md pt-6">
          <DialogHeader>
            <DialogTitle>Submit Quiz</DialogTitle>
            <DialogDescription>Are you sure you want to submit your quiz?</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Answered:</span> {answeredQuestions} / {totalQuestions}
            </p>
            <p className="text-sm text-destructive-primary">
              <span className="font-semibold">Warning:</span> You cannot change your answers after submission.
            </p>
          </div>
          <DialogFooter className="flex max-md:flex-col max-md:items-end max-md:space-y-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="max-md:w-full">
              Cancel
            </Button>
            <Button onClick={handleConfirmSubmit} disabled={isSubmitting} className="max-md:w-full">
              {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
