import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { authHeaders } from '@/lib/api';

// Course status types and constants
export type CourseStatus = 'draft' | 'published';
export type CourseRootStatus = 'draft' | 'published';

export const COURSE_STATUSES: CourseStatus[] = ['draft', 'published'];
export const COURSE_ROOT_STATUSES: CourseRootStatus[] = ['draft', 'published'];

// Type definitions
export interface Instructor {
  id: string;
  name: string;
  email: string;
}

export interface ModuleStats {
  totalModules: number;
  totalLessons: number;
}

export interface CourseData {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  currency: string;
  language: string;
  instructor: Instructor;
  thumbnailUrl?: string;
  promoVideoUrl?: string;
  duration: number;
  moduleStats: ModuleStats;
  totalEnrolled: number;
  ratingAverage: number;
  ratingCount: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CoursesListResponse {
  status: number;
  message: string;
  data: CourseData[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface CourseDetailResponse {
  status: number;
  message: string;
  data: CourseData;
}

export interface CreateCoursePayload {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  price: number;
  currency?: string;
  thumbnailUrl?: string;
  promoVideoUrl?: string;
  isPublished?: boolean;
}

export interface UpdateCoursePayload {
  title?: string;
  slug?: string;
  shortDescription?: string;
  fullDescription?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  language?: string;
  price?: number;
  currency?: string;
  thumbnailUrl?: string;
  promoVideoUrl?: string;
  isPublished?: boolean;
}

export type CourseListFilters = {
  page?: number;
  perPage?: number;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  isPublished?: boolean;
  search?: string;
};

// Fetch functions
export const fetchCoursesList = async (filters: CourseListFilters = {}): Promise<CoursesListResponse> => {
  const params: Record<string, string | number | boolean> = {
    page: filters.page || 1,
    perPage: filters.perPage || 30,
  };

  if (filters.category) params.category = filters.category;
  if (filters.level) params.level = filters.level;
  if (filters.isPublished !== undefined) params.isPublished = filters.isPublished;
  if (filters.search) params.search = filters.search;

  try {
    const response = await api.get('/v1/admin/courses', {
      headers: await authHeaders(),
      params,
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch courses');
    return json as CoursesListResponse;
  } catch (error) {
    throw error;
  }
};

export const fetchCourseById = async (id: string): Promise<CourseDetailResponse> => {
  try {
    const response = await api.get(`/v1/admin/courses/${id}`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch course');
    return json as CourseDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const createCourse = async (payload: CreateCoursePayload): Promise<CourseDetailResponse> => {
  try {
    const response = await api.post('/v1/admin/courses', {
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to create course');
    return json as CourseDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const updateCourse = async (id: string, payload: UpdateCoursePayload): Promise<CourseDetailResponse> => {
  try {
    const response = await api.put(`/v1/admin/courses/${id}`, {
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to update course');
    return json as CourseDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const deleteCourse = async (id: string): Promise<{ status: number; message: string }> => {
  try {
    const response = await api.delete(`/v1/admin/courses/${id}`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to delete course');
    return json;
  } catch (error) {
    throw error;
  }
};

// React Query hooks
export const useCoursesList = (filters: CourseListFilters = {}) => {
  return useQuery({
    queryKey: ['courses-list', filters],
    queryFn: () => fetchCoursesList(filters),
    refetchOnMount: true,
  });
};

export const useCourseById = (id: string) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => fetchCourseById(id),
    refetchOnMount: true,
    enabled: !!id,
  });
};

