import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface ModuleStats {
  totalModules: number;
  totalLessons: number;
}

export interface PublicCourse {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  tags: string[];
  price: number;
  currency: string;
  thumbnailUrl?: string;
  promoVideoUrl?: string;
  level?: string;
  language: string;
  duration?: number;
  estimatedEffort?: string;
  courseType: string;
  moduleStats: ModuleStats;
  totalEnrolled: number;
  ratingAverage: number;
  ratingCount: number;
  isPublished: boolean;
  status: string;
  visibility: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicCoursesFilters {
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PublicCoursesResponse {
  status: number;
  message: string;
  data: PublicCourse[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

// Fetch functions
export const fetchPublicCoursesList = async (filters: PublicCoursesFilters = {}): Promise<PublicCoursesResponse> => {
  const params: Record<string, string | number> = {
    page: filters.page || 1,
    perPage: filters.perPage || 30,
  };

  if (filters.search) params.search = filters.search;
  if (filters.category) params.category = filters.category;
  if (filters.level) params.level = filters.level;
  if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
  if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;

  try {
    const response = await api.get('/v1/courses', {
      params,
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch courses');
    return json as PublicCoursesResponse;
  } catch (error) {
    throw error;
  }
};

// React Query hooks
export const usePublicCoursesList = (filters: PublicCoursesFilters = {}) => {
  return useQuery({
    queryKey: ['public-courses-list', filters],
    queryFn: () => fetchPublicCoursesList(filters),
    refetchOnMount: true,
  });
};
