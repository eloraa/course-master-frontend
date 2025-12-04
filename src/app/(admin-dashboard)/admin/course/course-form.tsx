'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createCourse, updateCourse, type CreateCoursePayload, type UpdateCoursePayload, type CourseData } from '@/data/admin/courses';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface CourseFormProps {
  course?: CourseData;
}

export const CourseForm = ({ course }: CourseFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const isEditMode = !!course;

  const [formData, setFormData] = React.useState({
    title: course?.title || '',
    slug: course?.slug || '',
    shortDescription: course?.shortDescription || '',
    fullDescription: course?.fullDescription || '',
    category: course?.category || '',
    level: course?.level || 'beginner',
    language: course?.language || 'English',
    price: course?.price?.toString() || '0',
    currency: course?.currency || 'USD',
    thumbnailUrl: course?.thumbnailUrl || '',
    promoVideoUrl: course?.promoVideoUrl || '',
    isPublished: course?.isPublished || false,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (formData.title.length > 200) newErrors.title = 'Title must be at most 200 characters';

    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) newErrors.slug = 'Slug must be lowercase letters, numbers, and hyphens only';

    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (formData.shortDescription.length > 500) newErrors.shortDescription = 'Short description must be at most 500 characters';

    if (!formData.fullDescription.trim()) newErrors.fullDescription = 'Full description is required';

    if (!formData.category.trim()) newErrors.category = 'Category is required';

    if (!formData.language.trim()) newErrors.language = 'Language is required';

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) newErrors.price = 'Price must be a valid number >= 0';

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
        slug: formData.slug,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        category: formData.category,
        level: formData.level as 'beginner' | 'intermediate' | 'advanced',
        language: formData.language,
        price: parseFloat(formData.price),
        currency: formData.currency,
        ...(formData.thumbnailUrl && { thumbnailUrl: formData.thumbnailUrl }),
        ...(formData.promoVideoUrl && { promoVideoUrl: formData.promoVideoUrl }),
        isPublished: formData.isPublished,
      };

      if (isEditMode && course) {
        await updateCourse(course.id, payload as UpdateCoursePayload);
        toast.success('Course updated successfully');
      } else {
        await createCourse(payload as CreateCoursePayload);
        toast.success('Course created successfully');
      }

      router.push('/admin/course');
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save course';
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
    setFormData(prev => ({ ...prev, isPublished: e.target.checked }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/course">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1>{isEditMode ? 'Edit Course' : 'Create Course'}</h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode ? 'Update course information and details' : 'Add a new course to your platform'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Course title, description, and category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Advanced React Development"
                value={formData.title}
                onChange={handleInputChange}
                disabled={isLoading}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                name="slug"
                placeholder="e.g., advanced-react-development"
                value={formData.slug}
                onChange={handleInputChange}
                disabled={isLoading}
                className={errors.slug ? 'border-destructive' : ''}
              />
              <p className="text-xs text-muted-foreground">Lowercase letters, numbers, and hyphens only</p>
              {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Textarea
                id="shortDescription"
                name="shortDescription"
                placeholder="Brief description of the course (max 500 characters)"
                value={formData.shortDescription}
                onChange={handleInputChange}
                disabled={isLoading}
                rows={2}
                className={errors.shortDescription ? 'border-destructive' : ''}
              />
              <p className="text-xs text-muted-foreground">{formData.shortDescription.length}/500</p>
              {errors.shortDescription && <p className="text-sm text-destructive">{errors.shortDescription}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullDescription">Full Description *</Label>
              <Textarea
                id="fullDescription"
                name="fullDescription"
                placeholder="Detailed course description"
                value={formData.fullDescription}
                onChange={handleInputChange}
                disabled={isLoading}
                rows={5}
                className={errors.fullDescription ? 'border-destructive' : ''}
              />
              {errors.fullDescription && <p className="text-sm text-destructive">{errors.fullDescription}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="e.g., Web Development"
                  value={formData.category}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={errors.category ? 'border-destructive' : ''}
                />
                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language *</Label>
                <Input
                  id="language"
                  name="language"
                  placeholder="e.g., English"
                  value={formData.language}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={errors.language ? 'border-destructive' : ''}
                />
                {errors.language && <p className="text-sm text-destructive">{errors.language}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Details */}
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>Level, pricing, and instructor information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select value={formData.level} onValueChange={value => handleSelectChange('level', value)} disabled={isLoading}>
                  <SelectTrigger id="level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  step="0.01"
                  min="0"
                  className={errors.price ? 'border-destructive' : ''}
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={value => handleSelectChange('currency', value)} disabled={isLoading}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="SAR">SAR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
            <CardDescription>Thumbnail and promotional video URLs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
              <Input
                id="thumbnailUrl"
                name="thumbnailUrl"
                type="url"
                placeholder="https://example.com/thumbnail.jpg"
                value={formData.thumbnailUrl}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promoVideoUrl">Promotional Video URL</Label>
              <Input
                id="promoVideoUrl"
                name="promoVideoUrl"
                type="url"
                placeholder="https://example.com/video.mp4"
                value={formData.promoVideoUrl}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Publishing */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
            <CardDescription>Control the visibility of your course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={handleCheckboxChange}
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isPublished" className="font-normal cursor-pointer">
                Publish this course immediately
              </Label>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {formData.isPublished ? 'This course is visible to users' : 'This course is in draft mode and not visible to users'}
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" disabled={isLoading} asChild>
            <Link href="/admin/course">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Spinner className="mr-2 h-4 w-4" />}
            {isEditMode ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </form>
    </div>
  );
};
