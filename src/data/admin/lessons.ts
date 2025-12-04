import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { authHeaders } from '@/lib/api';

// Type definitions
export type LessonType = 'video' | 'article' | 'quiz' | 'assignment';

export interface Resource {
  label: string;
  url: string;
}

export interface Lesson {
  id: string;
  title: string;
  course: string;
  module: string;
  type: LessonType;
  content: string;
  duration?: number;
  resources?: Resource[];
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface LessonsListResponse {
  status: number;
  message: string;
  data: Lesson[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface LessonDetailResponse {
  status: number;
  message: string;
  data: Lesson;
}

export interface CreateLessonPayload {
  title: string;
  course: string;
  module: string;
  type: LessonType;
  content: string;
  duration?: number;
  resources?: Resource[];
  order: number;
  isPublished?: boolean;
}

export interface UpdateLessonPayload {
  title?: string;
  type?: LessonType;
  content?: string;
  duration?: number;
  resources?: Resource[];
  order?: number;
  isPublished?: boolean;
}

export type LessonListFilters = {
  page?: number;
  perPage?: number;
  course?: string;
  module?: string;
  type?: LessonType;
  isPublished?: boolean;
};

// Fetch functions
export const fetchLessonsList = async (filters: LessonListFilters = {}): Promise<LessonsListResponse> => {
  const params: Record<string, string | number | boolean> = {
    page: filters.page || 1,
    perPage: filters.perPage || 30,
  };

  if (filters.course) params.course = filters.course;
  if (filters.module) params.module = filters.module;
  if (filters.type) params.type = filters.type;
  if (filters.isPublished !== undefined) params.isPublished = filters.isPublished;

  try {
    const response = await api.get('/v1/admin/lessons', {
      headers: await authHeaders(),
      params,
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch lessons');
    return json as LessonsListResponse;
  } catch (error) {
    throw error;
  }
};

export const fetchLessonById = async (id: string): Promise<LessonDetailResponse> => {
  try {
    const response = await api.get(`/v1/admin/lessons/${id}`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch lesson');
    return json as LessonDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const createLesson = async (payload: CreateLessonPayload): Promise<LessonDetailResponse> => {
  try {
    const response = await api.post('/v1/admin/lessons', {
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to create lesson');
    return json as LessonDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const updateLesson = async (id: string, payload: UpdateLessonPayload): Promise<LessonDetailResponse> => {
  try {
    const response = await api.put(`/v1/admin/lessons/${id}`, {
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to update lesson');
    return json as LessonDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const deleteLesson = async (id: string): Promise<{ status: number; message: string }> => {
  try {
    const response = await api.delete(`/v1/admin/lessons/${id}`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to delete lesson');
    return json;
  } catch (error) {
    throw error;
  }
};

// React Query hooks
export const useLessonsList = (filters: LessonListFilters = {}) => {
  return useQuery({
    queryKey: ['lessons-list', filters],
    queryFn: () => fetchLessonsList(filters),
    refetchOnMount: true,
  });
};

export const useLessonById = (id: string) => {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: () => fetchLessonById(id),
    refetchOnMount: true,
    enabled: !!id,
  });
};
