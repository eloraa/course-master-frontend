import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, authHeaders } from '@/lib/api';

export interface Module {
  id: string;
  title: string;
  description?: string;
  course: string;
  order: number;
  isPublished: boolean;
  lessonCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  _id?: string;
  label: string;
  url: string;
}

export interface Lesson {
  id: string;
  title: string;
  course: string;
  module: string;
  type: 'video' | 'article' | 'quiz' | 'assignment';
  content: string;
  duration?: number;
  resources: Resource[];
  order: number;
  isPublished: boolean;
  quiz?: string;
  assignment?: string;
  completed: boolean;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ModulesResponse {
  status: number;
  message: string;
  data: Module[];
}

export interface LessonsResponse {
  status: number;
  message: string;
  data: Lesson[];
}

export interface LessonResponse {
  status: number;
  message: string;
  data: Lesson;
}

export interface CompleteLessonResponse {
  status: number;
  message: string;
  data: {
    course: string;
    lesson: string;
    progress: {
      percentage: number;
      completedLessons: number;
      totalLessons: number;
    };
  };
}

// Fetch course modules
export const fetchCourseModules = async (courseId: string): Promise<ModulesResponse> => {
  try {
    const response = await api.get(`/v1/me/courses/${courseId}/modules`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch modules');
    return json as ModulesResponse;
  } catch (error) {
    throw error;
  }
};

// Fetch module lessons
export const fetchModuleLessons = async (courseId: string, moduleId: string): Promise<LessonsResponse> => {
  try {
    const response = await api.get(`/v1/me/courses/${courseId}/modules/${moduleId}/lessons`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch lessons');
    return json as LessonsResponse;
  } catch (error) {
    throw error;
  }
};

// Fetch single lesson
export const fetchLesson = async (courseId: string, lessonId: string): Promise<LessonResponse> => {
  try {
    const response = await api.get(`/v1/me/courses/${courseId}/lessons/${lessonId}`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch lesson');
    return json as LessonResponse;
  } catch (error) {
    throw error;
  }
};

// Complete lesson
export const completeLesson = async (courseId: string, lessonId: string): Promise<CompleteLessonResponse> => {
  try {
    const response = await api.post(`/v1/me/courses/${courseId}/lessons/${lessonId}/complete`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to complete lesson');
    return json as CompleteLessonResponse;
  } catch (error) {
    throw error;
  }
};

// React Query hooks
export const useCourseModules = (courseId: string) => {
  return useQuery({
    queryKey: ['course-modules', courseId],
    queryFn: () => fetchCourseModules(courseId),
    refetchOnMount: true,
    enabled: !!courseId,
  });
};

export const useModuleLessons = (courseId: string, moduleId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['module-lessons', courseId, moduleId],
    queryFn: () => fetchModuleLessons(courseId, moduleId),
    refetchOnMount: true,
    enabled: enabled && !!courseId && !!moduleId,
  });
};

export const useLesson = (courseId: string, lessonId: string) => {
  return useQuery({
    queryKey: ['lesson', courseId, lessonId],
    queryFn: () => fetchLesson(courseId, lessonId),
    refetchOnMount: true,
    enabled: !!courseId && !!lessonId,
  });
};

export const useCompleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, lessonId }: { courseId: string; lessonId: string }) =>
      completeLesson(courseId, lessonId),
    onSuccess: (data, variables) => {
      // Invalidate course progress
      queryClient.invalidateQueries({ queryKey: ['enrollment-status', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
    },
  });
};
