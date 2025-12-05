import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PublicCourse } from './courses';

export interface CourseDetailsResponse {
  status: number;
  message: string;
  data: PublicCourse;
}

export const fetchCourseDetails = async (slug: string): Promise<CourseDetailsResponse> => {
  try {
    const response = await api.get(`/v1/courses/${slug}`, {});
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch course');
    return json as CourseDetailsResponse;
  } catch (error) {
    throw error;
  }
};

export const useCourseDetails = (slug: string) => {
  return useQuery({
    queryKey: ['course-details', slug],
    queryFn: () => fetchCourseDetails(slug),
    refetchOnMount: true,
    enabled: !!slug,
  });
};
