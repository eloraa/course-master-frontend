'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createQuiz, updateQuiz, type Quiz, type CreateQuizPayload, type UpdateQuizPayload, type Question } from '@/data/admin/quizzes';
import Link from 'next/link';
import { ChevronLeft, Plus, Trash2, GripVertical, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ModulePopover } from './module-popover';

interface QuizFormProps {
  courseId: string;
  quiz?: Quiz;
}

export const QuizForm = ({ courseId, quiz }: QuizFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const isEditMode = !!quiz;

  const [formData, setFormData] = React.useState({
    title: quiz?.title || '',
    description: quiz?.description || '',
    timeLimit: quiz?.timeLimit?.toString() || '',
    maxAttempts: quiz?.maxAttempts?.toString() || '',
    passingScore: quiz?.passingScore?.toString() || '',
    randomizeQuestions: quiz?.randomizeQuestions || false,
    showResults: quiz?.showResults || false,
    isPublished: quiz?.isPublished || false,
  });

  const [selectedModuleId, setSelectedModuleId] = React.useState<string | undefined>(quiz?.module);
  const [selectedModuleTitle, setSelectedModuleTitle] = React.useState<string | undefined>();

  const [questions, setQuestions] = React.useState<Question[]>(quiz?.questions || []);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = React.useState<number | null>(null);
  const [showQuestionDialog, setShowQuestionDialog] = React.useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = React.useState<number | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const [questionForm, setQuestionForm] = React.useState<Question>({
    title: '',
    content: '',
    type: 'multiple-choice',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
    correctAnswer: 0,
    points: 1,
    explanation: '',
    order: 0,
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Quiz title is required';
    if (formData.title.length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (formData.title.length > 200) newErrors.title = 'Title must be at most 200 characters';

    if (!formData.description.trim()) newErrors.description = 'Description is required';

    if (formData.timeLimit && (isNaN(Number(formData.timeLimit)) || Number(formData.timeLimit) < 0)) {
      newErrors.timeLimit = 'Time limit must be a valid number >= 0';
    }

    if (formData.maxAttempts && (isNaN(Number(formData.maxAttempts)) || Number(formData.maxAttempts) < 0)) {
      newErrors.maxAttempts = 'Max attempts must be a valid number >= 0';
    }

    if (formData.passingScore && (isNaN(Number(formData.passingScore)) || Number(formData.passingScore) < 0 || Number(formData.passingScore) > 100)) {
      newErrors.passingScore = 'Passing score must be between 0-100';
    }

    if (questions.length === 0) newErrors.questions = 'Quiz must have at least one question';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setIsLoading(true);

      const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

      // Update order for all questions
      const questionsWithOrder = questions.map((q, idx) => ({
        ...q,
        order: idx,
      }));

      const payload = {
        title: formData.title,
        description: formData.description,
        ...(formData.timeLimit && { timeLimit: Number(formData.timeLimit) }),
        ...(formData.maxAttempts && { maxAttempts: Number(formData.maxAttempts) }),
        ...(formData.passingScore && { passingScore: Number(formData.passingScore) }),
        randomizeQuestions: formData.randomizeQuestions,
        showResults: formData.showResults,
        isPublished: formData.isPublished,
        questions: questionsWithOrder,
        totalPoints,
      };

      const quizPayload = {
        ...payload,
        ...(selectedModuleId && { module: selectedModuleId }),
      };

      if (isEditMode && quiz) {
        await updateQuiz(quiz.id, quizPayload as UpdateQuizPayload);
        toast.success('Quiz updated successfully');
      } else {
        await createQuiz({
          ...quizPayload,
          course: courseId,
        } as CreateQuizPayload);
        toast.success('Quiz created successfully');
      }

      router.push(`/admin/course/view/${courseId}/quiz`);
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save quiz';
      toast.error(errorMessage);
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const openQuestionDialog = (index?: number) => {
    if (index !== undefined) {
      setEditingQuestionIndex(index);
      setQuestionForm(questions[index]);
    } else {
      setEditingQuestionIndex(null);
      setQuestionForm({
        title: '',
        content: '',
        type: 'multiple-choice',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
        correctAnswer: 0,
        points: 1,
        explanation: '',
        order: questions.length,
      });
    }
    setShowQuestionDialog(true);
  };

  const closeQuestionDialog = () => {
    setShowQuestionDialog(false);
    setEditingQuestionIndex(null);
  };

  const saveQuestion = () => {
    if (!questionForm.title.trim()) {
      toast.error('Question title is required');
      return;
    }

    if (!questionForm.content.trim()) {
      toast.error('Question content is required');
      return;
    }

    if (questionForm.points <= 0) {
      toast.error('Points must be greater than 0');
      return;
    }

    if (questionForm.type === 'multiple-choice' || questionForm.type === 'multiple-answer') {
      if (!questionForm.options || questionForm.options.length < 2) {
        toast.error('Multiple choice questions need at least 2 options');
        return;
      }
      if (questionForm.options.some(opt => !opt.text.trim())) {
        toast.error('All options must have text');
        return;
      }
      if (!questionForm.options.some(opt => opt.isCorrect)) {
        toast.error('At least one option must be marked as correct');
        return;
      }
    }

    if (editingQuestionIndex !== null) {
      const newQuestions = [...questions];
      newQuestions[editingQuestionIndex] = questionForm;
      setQuestions(newQuestions);
      toast.success('Question updated');
    } else {
      setQuestions([...questions, questionForm]);
      toast.success('Question added');
    }
    closeQuestionDialog();
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
    toast.success('Question deleted');
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    setDraggedOverIndex(index);
    const newQuestions = [...questions];
    const draggedQuestion = newQuestions[draggedIndex];
    newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(index, 0, draggedQuestion);
    setDraggedIndex(index);
    setQuestions(newQuestions);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDraggedOverIndex(null);
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/course/view/${courseId}/quiz`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1>{isEditMode ? 'Edit Quiz' : 'Create Quiz'}</h1>
          <p className="text-sm text-muted-foreground">{isEditMode ? 'Update quiz information and questions' : 'Create a new quiz for your course'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Quiz title and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., React Fundamentals Quiz"
                value={formData.title}
                onChange={handleInputChange}
                disabled={isLoading}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && <p className="text-sm text-destructive-primary">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what this quiz covers"
                value={formData.description}
                onChange={handleInputChange}
                disabled={isLoading}
                rows={3}
                className={errors.description ? 'border-destructive' : ''}
              />
              {errors.description && <p className="text-sm text-destructive-primary">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="module">Module (Optional)</Label>
              <div className="relative">
                <ModulePopover
                  courseId={courseId}
                  selectedModuleId={selectedModuleId}
                  selectedModuleTitle={selectedModuleTitle}
                  onSelect={(moduleId, moduleTitle) => {
                    setSelectedModuleId(moduleId);
                    setSelectedModuleTitle(moduleTitle);
                  }}
                />
                {selectedModuleId && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => {
                      setSelectedModuleId(undefined);
                      setSelectedModuleTitle(undefined);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Settings</CardTitle>
            <CardDescription>Configure time limit, attempts, and scoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Input
                  id="timeLimit"
                  name="timeLimit"
                  type="number"
                  placeholder="Leave empty for no limit"
                  value={formData.timeLimit}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  min="0"
                  className={errors.timeLimit ? 'border-destructive' : ''}
                />
                {errors.timeLimit && <p className="text-sm text-destructive-primary">{errors.timeLimit}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAttempts">Max Attempts</Label>
                <Input
                  id="maxAttempts"
                  name="maxAttempts"
                  type="number"
                  placeholder="Leave empty for unlimited"
                  value={formData.maxAttempts}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  min="0"
                  className={errors.maxAttempts ? 'border-destructive' : ''}
                />
                {errors.maxAttempts && <p className="text-sm text-destructive-primary">{errors.maxAttempts}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="passingScore">Passing Score (%)</Label>
                <Input
                  id="passingScore"
                  name="passingScore"
                  type="number"
                  placeholder="e.g., 70"
                  value={formData.passingScore}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  min="0"
                  max="100"
                  className={errors.passingScore ? 'border-destructive' : ''}
                />
                {errors.passingScore && <p className="text-sm text-destructive-primary">{errors.passingScore}</p>}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="randomizeQuestions"
                  name="randomizeQuestions"
                  checked={formData.randomizeQuestions}
                  onChange={handleCheckboxChange}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="randomizeQuestions" className="font-normal cursor-pointer">
                  Randomize question order
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showResults"
                  name="showResults"
                  checked={formData.showResults}
                  onChange={handleCheckboxChange}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="showResults" className="font-normal cursor-pointer">
                  Show results to students after completion
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Questions</CardTitle>
              <CardDescription>
                Create and manage quiz questions ({questions.length} total, {totalPoints} points)
              </CardDescription>
            </div>
            <Button type="button" size="sm" onClick={() => openQuestionDialog()} disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </CardHeader>
          <CardContent>
            {errors.questions && <p className="text-sm text-destructive-primary mb-4">{errors.questions}</p>}

            {questions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No questions yet. Add your first question to get started.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={() => handleDragOver(index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-grab active:cursor-grabbing transition-all ${draggedIndex === index ? 'opacity-50' : ''} ${
                      draggedOverIndex === index ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{question.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {question.type} • {question.points} point{question.points !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button type="button" variant="outline" size="sm" onClick={() => openQuestionDialog(index)} disabled={isLoading}>
                        Edit
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => deleteQuestion(index)} disabled={isLoading}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Publishing */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
            <CardDescription>Control the visibility of your quiz</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleCheckboxChange}
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isPublished" className="font-normal cursor-pointer">
                Publish this quiz immediately
              </Label>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{formData.isPublished ? 'This quiz is visible to students' : 'This quiz is in draft mode and not visible to students'}</p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" disabled={isLoading} asChild>
            <Link href={`/admin/course/view/${courseId}/quiz`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Spinner className="mr-2 h-4 w-4" />}
            {isEditMode ? 'Update Quiz' : 'Create Quiz'}
          </Button>
        </div>
      </form>

      {/* Question Dialog */}
      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <DialogContent className="md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingQuestionIndex !== null ? 'Edit Question' : 'Add Question'}</DialogTitle>
            <DialogDescription>Create a new question for your quiz</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question-title">Question Title *</Label>
              <Input id="question-title" placeholder="e.g., What is React?" value={questionForm.title} onChange={e => setQuestionForm(prev => ({ ...prev, title: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="question-content">Question Content *</Label>
              <Textarea id="question-content" placeholder="Enter your question" value={questionForm.content} onChange={e => setQuestionForm(prev => ({ ...prev, content: e.target.value }))} rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="question-type">Question Type *</Label>
              <Select
                value={questionForm.type}
                onValueChange={value => {
                  setQuestionForm(prev => ({
                    ...prev,
                    type: value as any,
                    options:
                      value === 'true-false'
                        ? [
                            { text: 'True', isCorrect: false },
                            { text: 'False', isCorrect: false },
                          ]
                        : prev.options,
                  }));
                }}
              >
                <SelectTrigger id="question-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="multiple-answer">Multiple Answer</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question-points">Points *</Label>
              <Input id="question-points" type="number" min="1" value={questionForm.points} onChange={e => setQuestionForm(prev => ({ ...prev, points: Number(e.target.value) || 1 }))} />
            </div>

            {(questionForm.type === 'multiple-choice' || questionForm.type === 'multiple-answer') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Options</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuestionForm(prev => ({
                        ...prev,
                        options: [...(prev.options || []), { text: '', isCorrect: false }],
                      }));
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </div>
                {questionForm.options?.map((option, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <Input
                      placeholder={`Option ${idx + 1}`}
                      value={option.text}
                      onChange={e => {
                        const newOptions = [...(questionForm.options || [])];
                        newOptions[idx] = { ...newOptions[idx], text: e.target.value };
                        setQuestionForm(prev => ({ ...prev, options: newOptions }));
                      }}
                    />
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={e => {
                        const newOptions = [...(questionForm.options || [])];
                        if (questionForm.type === 'multiple-choice') {
                          // For single choice, uncheck all others
                          newOptions.forEach((opt, i) => {
                            opt.isCorrect = i === idx && e.target.checked;
                          });
                        } else {
                          // For multiple answer, allow multiple checks
                          newOptions[idx] = { ...newOptions[idx], isCorrect: e.target.checked };
                        }
                        setQuestionForm(prev => ({ ...prev, options: newOptions }));
                      }}
                      className="w-4 h-4 mt-3"
                    />
                    {questionForm.options!.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newOptions = questionForm.options!.filter((_, i) => i !== idx);
                          setQuestionForm(prev => ({
                            ...prev,
                            options: newOptions,
                          }));
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {questionForm.type === 'true-false' && (
              <div className="space-y-2">
                <Label>Correct Answer *</Label>
                <div className="flex gap-4">
                  {questionForm.options?.map((option, idx) => (
                    <label key={idx} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={e => {
                          const newOptions = [...(questionForm.options || [])];
                          newOptions.forEach((opt, i) => {
                            opt.isCorrect = i === idx && e.target.checked;
                          });
                          setQuestionForm(prev => ({ ...prev, options: newOptions }));
                        }}
                      />
                      {option.text}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="question-explanation">Explanation (Optional)</Label>
              <Textarea
                id="question-explanation"
                placeholder="Explain the correct answer"
                value={questionForm.explanation || ''}
                onChange={e => setQuestionForm(prev => ({ ...prev, explanation: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeQuestionDialog}>
              Cancel
            </Button>
            <Button onClick={saveQuestion}>{editingQuestionIndex !== null ? 'Update Question' : 'Add Question'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
