import { useQuery } from '@tanstack/react-query';
import { api, authHeaders } from '@/lib/api';

// ============================================================================
// ORDER STATISTICS
// ============================================================================

export interface OrdersBreakdown {
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
  refunded: number;
}

export interface PaymentBreakdown {
  completed: number;
  pending: number;
  failed: number;
  refunded: number;
}

export interface TopCourse {
  courseId: string;
  courseTitle: string;
  totalSales: number;
  totalRevenue: number;
}

export interface OrderStatisticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  ordersBreakdown: OrdersBreakdown;
  paymentBreakdown: PaymentBreakdown;
  topCourses: TopCourse[];
  dateRange: {
    from: string;
    to: string;
  };
}

export interface OrderStatisticsResponse {
  status: number;
  message: string;
  data: OrderStatisticsData;
}

export type OrderStatisticsFilters = {
  startDate?: string;
  endDate?: string;
};

export const fetchOrderStatistics = async (filters: OrderStatisticsFilters = {}): Promise<OrderStatisticsResponse> => {
  const params: Record<string, string> = {};
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;

  try {
    const response = await api.get('/v1/admin/orders/stats', {
      headers: await authHeaders(),
      params,
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch order statistics');
    return json as OrderStatisticsResponse;
  } catch (error) {
    throw error;
  }
};

export const useOrderStatistics = (filters: OrderStatisticsFilters = {}) => {
  return useQuery({
    queryKey: ['order-statistics', filters],
    queryFn: () => fetchOrderStatistics(filters),
    refetchOnMount: true,
  });
};

// ============================================================================
// COURSE STATISTICS
// ============================================================================

export interface CourseDetail {
  courseId: string;
  title: string;
  slug: string;
  isPublished: boolean;
  totalEnrolled: number;
  revenue: number;
  averageRating: number;
  ratingCount: number;
  totalLessons: number;
  totalDuration: number;
  createdAt: string;
}

export interface CourseSummary {
  averageEnrollmentPerCourse: number;
  averageRevenuePerCourse: number;
  topCourse: {
    courseId: string;
    title: string;
    enrollments: number;
    revenue: number;
  };
}

export interface CourseStatisticsData {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  averageRating: number;
  courses: CourseDetail[];
  summary: CourseSummary;
}

export interface CourseStatisticsResponse {
  status: number;
  message: string;
  data: CourseStatisticsData;
}

export type CourseStatisticsFilters = {
  courseId?: string;
  startDate?: string;
  endDate?: string;
};

export const fetchCourseStatistics = async (filters: CourseStatisticsFilters = {}): Promise<CourseStatisticsResponse> => {
  const params: Record<string, string> = {};
  if (filters.courseId) params.courseId = filters.courseId;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;

  try {
    const response = await api.get('/v1/admin/courses/stats', {
      headers: await authHeaders(),
      params,
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch course statistics');
    return json as CourseStatisticsResponse;
  } catch (error) {
    throw error;
  }
};

export const useCourseStatistics = (filters: CourseStatisticsFilters = {}) => {
  return useQuery({
    queryKey: ['course-statistics', filters],
    queryFn: () => fetchCourseStatistics(filters),
    refetchOnMount: true,
  });
};

// ============================================================================
// QUIZ STATISTICS
// ============================================================================

export interface QuizDifficulty {
  averageTimeSpent: number;
  timeTaken: {
    min: number;
    max: number;
    average: number;
  };
}

export interface QuizDetail {
  quizId: string;
  title: string;
  course: {
    courseId: string;
    title: string;
  };
  submissionCount: number;
  averageScore: number;
  passRate: number;
  passCount: number;
  failCount: number;
  totalPoints: number;
  averagePointsEarned: number;
  difficulty: QuizDifficulty;
  createdAt: string;
}

export interface QuizSummary {
  totalParticipants: number;
  completionRate: number;
  mostDifficultQuiz: {
    quizId: string;
    title: string;
    averageScore: number;
    passRate: number;
  };
  easiestQuiz: {
    quizId: string;
    title: string;
    averageScore: number;
    passRate: number;
  };
}

export interface QuizStatisticsData {
  totalQuizzes: number;
  totalSubmissions: number;
  averageScore: number;
  averagePassRate: number;
  quizzes: QuizDetail[];
  summary: QuizSummary;
}

export interface QuizStatisticsResponse {
  status: number;
  message: string;
  data: QuizStatisticsData;
}

export type QuizStatisticsFilters = {
  quizId?: string;
  courseId?: string;
  startDate?: string;
  endDate?: string;
};

export const fetchQuizStatistics = async (filters: QuizStatisticsFilters = {}): Promise<QuizStatisticsResponse> => {
  const params: Record<string, string> = {};
  if (filters.quizId) params.quizId = filters.quizId;
  if (filters.courseId) params.courseId = filters.courseId;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;

  try {
    const response = await api.get('/v1/admin/quizzes/stats', {
      headers: await authHeaders(),
      params,
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch quiz statistics');
    return json as QuizStatisticsResponse;
  } catch (error) {
    throw error;
  }
};

export const useQuizStatistics = (filters: QuizStatisticsFilters = {}) => {
  return useQuery({
    queryKey: ['quiz-statistics', filters],
    queryFn: () => fetchQuizStatistics(filters),
    refetchOnMount: true,
  });
};

// ============================================================================
// USER/ENROLLMENT STATISTICS
// ============================================================================

export interface EnrollmentDistribution {
  '0_courses': number;
  '1_5_courses': number;
  '6_10_courses': number;
  '10plus_courses': number;
}

export interface ActiveUsers {
  last24h: number;
  last7d: number;
  last30d: number;
}

export interface UserEngagementLevel {
  count: number;
  description: string;
}

export interface UserEngagement {
  highEngagement: UserEngagementLevel;
  mediumEngagement: UserEngagementLevel;
  lowEngagement: UserEngagementLevel;
}

export interface TopCourseByEnrollment {
  courseId: string;
  title: string;
  enrollmentCount: number;
}

export interface UserStatisticsData {
  totalUsers: number;
  studentCount: number;
  adminCount: number;
  totalEnrollments: number;
  enrollmentDistribution: EnrollmentDistribution;
  activeUsers: ActiveUsers;
  averageEnrollmentPerUser: number;
  userEngagement: UserEngagement;
  topCoursesByEnrollment: TopCourseByEnrollment[];
}

export interface UserStatisticsResponse {
  status: number;
  message: string;
  data: UserStatisticsData;
}

export type UserStatisticsFilters = {
  role?: 'student' | 'admin';
  startDate?: string;
  endDate?: string;
};

export const fetchUserStatistics = async (filters: UserStatisticsFilters = {}): Promise<UserStatisticsResponse> => {
  const params: Record<string, string> = {};
  if (filters.role) params.role = filters.role;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;

  try {
    const response = await api.get('/v1/admin/users/stats', {
      headers: await authHeaders(),
      params,
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch user statistics');
    return json as UserStatisticsResponse;
  } catch (error) {
    throw error;
  }
};

export const useUserStatistics = (filters: UserStatisticsFilters = {}) => {
  return useQuery({
    queryKey: ['user-statistics', filters],
    queryFn: () => fetchUserStatistics(filters),
    refetchOnMount: true,
  });
};

// ============================================================================
// GENERIC ERROR TYPES
// ============================================================================

type ApiFieldErrors = Record<string, string[]>;
export interface ApiError {
  status: number;
  message: string;
  errors?: ApiFieldErrors;
}
