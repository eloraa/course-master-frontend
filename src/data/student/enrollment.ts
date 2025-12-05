import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, authHeaders } from '@/lib/api';

export interface EnrollmentData {
  course: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    thumbnailUrl?: string;
    price: number;
    duration?: number;
    level?: string;
  };
  batch?: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  enrolledAt: string;
  progress?: {
    percentage: number;
    completedLessons: number;
    lastAccessedAt: string;
  };
}

export interface EnrollCoursePayload {
  courseId: string;
  batchId?: string;
}

export interface EnrollCourseResponse {
  status: number;
  message: string;
  data: EnrollmentData;
}

export interface MyCoursesResponse {
  status: number;
  message: string;
  data: EnrollmentData[];
}

// Check if user is enrolled in a course
export const fetchEnrollmentStatus = async (courseId: string): Promise<boolean> => {
  try {
    const response = await api.get('/v1/me/courses', {
      headers: await authHeaders(),
    });
    const json = await response.json();

    if (!response.ok) return false;

    const enrollments = json.data as EnrollmentData[];
    return enrollments.some(enrollment => enrollment.course.id === courseId);
  } catch (error) {
    return false;
  }
};

// Enroll in a course
export const enrollCourse = async (payload: EnrollCoursePayload): Promise<EnrollCourseResponse> => {
  try {
    const response = await api.post('/v1/me/courses/enroll', {
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to enroll in course');
    return json as EnrollCourseResponse;
  } catch (error) {
    throw error;
  }
};

// Get all enrolled courses
export const fetchMyCourses = async (): Promise<MyCoursesResponse> => {
  try {
    const response = await api.get('/v1/me/courses', {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch enrolled courses');
    return json as MyCoursesResponse;
  } catch (error) {
    throw error;
  }
};

// React Query hooks
export const useEnrollmentStatus = (courseId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['enrollment-status', courseId],
    queryFn: () => fetchEnrollmentStatus(courseId),
    refetchOnMount: true,
    enabled: enabled && !!courseId,
  });
};

export const useMyCourses = () => {
  return useQuery({
    queryKey: ['my-courses'],
    queryFn: () => fetchMyCourses(),
    refetchOnMount: true,
  });
};

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EnrollCoursePayload) => enrollCourse(payload),
    onSuccess: (data) => {
      // Invalidate enrollment status and my courses queries
      queryClient.invalidateQueries({ queryKey: ['enrollment-status', data.data.course.id] });
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
    },
  });
};
