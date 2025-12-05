'use client';

import { Question } from '@/data/student/course-content';
import { CheckCircle2, XCircle, Circle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizQuestionProps {
  question: Question;
  selectedAnswer?: string;
  onAnswerChange: (questionId: string, answer: string) => void;
  isReviewMode: boolean;
}

export const QuizQuestion = ({
  question,
  selectedAnswer,
  onAnswerChange,
  isReviewMode,
}: QuizQuestionProps) => {
  return (
    <div className="border rounded-lg p-6 mb-6 bg-card">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{question.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{question.content}</p>
          <div className="text-xs text-muted-foreground mt-2">{question.points} points</div>
        </div>
        {isReviewMode && (
          <div className="ml-4">
            {question.isCorrect ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Correct</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Incorrect</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const optionId = option.id || String(index);
          const isSelected = selectedAnswer === optionId;
          const isCorrectOption = option.isCorrect;
          const showCorrectAnswer = isReviewMode && isCorrectOption;
          const showIncorrectAnswer = isReviewMode && isSelected && !isCorrectOption;

          return (
            <button
              key={optionId}
              onClick={() => !isReviewMode && onAnswerChange(question.questionId, optionId)}
              disabled={isReviewMode}
              className={cn(
                'flex items-center gap-3 w-full p-3 rounded-md border-2 transition-all text-left',
                'disabled:cursor-not-allowed',
                isSelected && !isReviewMode && 'border-primary bg-primary text-primary-foreground shadow-lg scale-105',
                !isSelected && !isReviewMode && 'border-border hover:border-primary/50 hover:bg-accent',
                showCorrectAnswer && 'border-green-600 bg-green-100 border-2',
                showIncorrectAnswer && 'border-red-600 bg-red-100 border-2',
                isReviewMode && !showCorrectAnswer && !showIncorrectAnswer && 'border-border opacity-60'
              )}
            >
              {isSelected ? (
                <Check className="w-5 h-5 shrink-0 flex-shrink-0 font-bold" />
              ) : (
                <Circle className="w-5 h-5 shrink-0 text-muted-foreground flex-shrink-0" />
              )}
              <span className="font-medium flex-1">{option.text}</span>
              {showCorrectAnswer && <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />}
              {showIncorrectAnswer && <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Review Mode - Show explanation */}
      {isReviewMode && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm">
            <p className="font-medium mb-2">Your answer: {selectedAnswer ? question.options.find(o => o.id === selectedAnswer)?.text : 'Not answered'}</p>
            {!question.isCorrect && (
              <p className="text-green-600">
                Correct answer: {question.options.find(o => o.isCorrect)?.text}
              </p>
            )}
            <p className="text-muted-foreground mt-2">
              Points: {question.earnedPoints} / {question.points}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
