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
import { createAssignment, updateAssignment, type Assignment, type CreateAssignmentPayload, type UpdateAssignmentPayload } from '@/data/admin/assignments';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CustomMarkdownEditor } from '@/components/markdown/custom-markdown-editor';

interface AssignmentFormProps {
  courseId: string;
  assignment?: Assignment;
}

export const AssignmentForm = ({ courseId, assignment }: AssignmentFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const isEditMode = !!assignment;

  const [formData, setFormData] = React.useState({
    title: assignment?.title || '',
    description: assignment?.description || '',
    instructions: assignment?.instructions || '',
    type: assignment?.type || 'text' as const,
    maxScore: assignment?.maxScore?.toString() || '100',
    passingScore: assignment?.passingScore?.toString() || '60',
    dueDate: assignment?.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : '',
    allowLateSubmission: assignment?.allowLateSubmission || false,
    latePenalty: assignment?.latePenalty?.toString() || '0',
    isPublished: assignment?.isPublished || false,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Assignment title is required';
    if (formData.title.length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (formData.title.length > 200) newErrors.title = 'Title must be at most 200 characters';

    if (!formData.description.trim()) newErrors.description = 'Description is required';

    if (!formData.instructions.trim()) newErrors.instructions = 'Instructions are required';

    if (isNaN(Number(formData.maxScore)) || Number(formData.maxScore) <= 0) {
      newErrors.maxScore = 'Max score must be a valid number > 0';
    }

    if (isNaN(Number(formData.passingScore)) || Number(formData.passingScore) < 0 || Number(formData.passingScore) > Number(formData.maxScore)) {
      newErrors.passingScore = `Passing score must be between 0 and ${formData.maxScore}`;
    }

    if (formData.allowLateSubmission && (isNaN(Number(formData.latePenalty)) || Number(formData.latePenalty) < 0 || Number(formData.latePenalty) > 100)) {
      newErrors.latePenalty = 'Late penalty must be between 0-100';
    }

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

      const payload = {
        title: formData.title,
        description: formData.description,
        instructions: formData.instructions,
        type: formData.type,
        maxScore: Number(formData.maxScore),
        passingScore: Number(formData.passingScore),
        ...(formData.dueDate && { dueDate: new Date(formData.dueDate).toISOString() }),
        allowLateSubmission: formData.allowLateSubmission,
        ...(formData.allowLateSubmission && { latePenalty: Number(formData.latePenalty) }),
        isPublished: formData.isPublished,
      };

      if (isEditMode && assignment) {
        await updateAssignment(assignment.id, payload as UpdateAssignmentPayload);
        toast.success('Assignment updated successfully');
      } else {
        await createAssignment({
          ...payload,
          course: courseId,
        } as CreateAssignmentPayload);
        toast.success('Assignment created successfully');
      }

      router.push(`/admin/course/view/${courseId}/assignments`);
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save assignment';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/course/view/${courseId}/assignments`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1>{isEditMode ? 'Edit Assignment' : 'Create Assignment'}</h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode ? 'Update assignment information and details' : 'Create a new assignment for your course'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Assignment title and type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Assignment Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., React Components Assignment"
                value={formData.title}
                onChange={handleInputChange}
                disabled={isLoading}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && <p className="text-sm text-destructive-primary">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Assignment Type *</Label>
              <Select value={formData.type} onValueChange={value => handleSelectChange('type', value)} disabled={isLoading}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Submission</SelectItem>
                  <SelectItem value="file">File Upload</SelectItem>
                  <SelectItem value="link">Link Submission</SelectItem>
                  <SelectItem value="code">Code</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
            <CardDescription>Assignment description (Markdown supported)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <CustomMarkdownEditor
              value={formData.description}
              onChange={(value) => {
                setFormData(prev => ({ ...prev, description: value }));
                if (errors.description) {
                  setErrors(prev => ({ ...prev, description: '' }));
                }
              }}
              placeholder="Enter assignment description"
              disabled={isLoading}
            />
            {errors.description && <p className="text-sm text-destructive-primary">{errors.description}</p>}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>Detailed instructions for students (Markdown supported)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="instructions">Instructions *</Label>
            <CustomMarkdownEditor
              value={formData.instructions}
              onChange={(value) => {
                setFormData(prev => ({ ...prev, instructions: value }));
                if (errors.instructions) {
                  setErrors(prev => ({ ...prev, instructions: '' }));
                }
              }}
              placeholder="Enter detailed instructions"
              disabled={isLoading}
            />
            {errors.instructions && <p className="text-sm text-destructive-primary">{errors.instructions}</p>}
          </CardContent>
        </Card>

        {/* Scoring */}
        <Card>
          <CardHeader>
            <CardTitle>Scoring</CardTitle>
            <CardDescription>Configure max score and passing score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxScore">Max Score *</Label>
                <Input
                  id="maxScore"
                  name="maxScore"
                  type="number"
                  placeholder="e.g., 100"
                  value={formData.maxScore}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  min="0"
                  className={errors.maxScore ? 'border-destructive' : ''}
                />
                {errors.maxScore && <p className="text-sm text-destructive-primary">{errors.maxScore}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="passingScore">Passing Score *</Label>
                <Input
                  id="passingScore"
                  name="passingScore"
                  type="number"
                  placeholder="e.g., 60"
                  value={formData.passingScore}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  min="0"
                  className={errors.passingScore ? 'border-destructive' : ''}
                />
                {errors.passingScore && <p className="text-sm text-destructive-primary">{errors.passingScore}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submission Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Submission Settings</CardTitle>
            <CardDescription>Configure due date and late submission policy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="allowLateSubmission"
                  name="allowLateSubmission"
                  checked={formData.allowLateSubmission}
                  onChange={handleCheckboxChange}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="allowLateSubmission" className="font-normal cursor-pointer">
                  Allow late submissions
                </Label>
              </div>

              {formData.allowLateSubmission && (
                <div className="space-y-2 ml-7">
                  <Label htmlFor="latePenalty">Late Penalty (%)</Label>
                  <Input
                    id="latePenalty"
                    name="latePenalty"
                    type="number"
                    placeholder="e.g., 10"
                    value={formData.latePenalty}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    min="0"
                    max="100"
                    className={errors.latePenalty ? 'border-destructive' : ''}
                  />
                  {errors.latePenalty && <p className="text-sm text-destructive-primary">{errors.latePenalty}</p>}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Publishing */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
            <CardDescription>Control the visibility of your assignment</CardDescription>
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
                Publish this assignment immediately
              </Label>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {formData.isPublished ? 'This assignment is visible to students' : 'This assignment is in draft mode and not visible to students'}
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" disabled={isLoading} asChild>
            <Link href={`/admin/course/view/${courseId}/assignments`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Spinner className="mr-2 h-4 w-4" />}
            {isEditMode ? 'Update Assignment' : 'Create Assignment'}
          </Button>
        </div>
      </form>
    </div>
  );
};
