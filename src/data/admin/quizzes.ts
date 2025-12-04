import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { authHeaders } from '@/lib/api';

// Type definitions
export type QuestionType = 'multiple-choice' | 'multiple-answer' | 'true-false';

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  title: string;
  content: string;
  type: QuestionType;
  options?: QuestionOption[];
  correctAnswer: string | number | number[];
  points: number;
  explanation?: string;
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  course: string;
  module?: string;
  lesson?: string;
  timeLimit?: number;
  maxAttempts?: number;
  passingScore?: number;
  totalPoints: number;
  randomizeQuestions?: boolean;
  showResults?: boolean;
  isPublished: boolean;
  questionCount: number;
  questions?: Question[];
  createdAt: string;
  updatedAt?: string;
}

export interface QuizzesListResponse {
  status: number;
  message: string;
  data: Quiz[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface QuizDetailResponse {
  status: number;
  message: string;
  data: Quiz;
}

export interface CreateQuizPayload {
  title: string;
  description: string;
  course: string;
  module?: string;
  lesson?: string;
  timeLimit?: number;
  maxAttempts?: number;
  passingScore?: number;
  randomizeQuestions?: boolean;
  showResults?: boolean;
  isPublished?: boolean;
  questions: Question[];
  totalPoints: number;
}

export interface UpdateQuizPayload {
  title?: string;
  description?: string;
  timeLimit?: number;
  maxAttempts?: number;
  passingScore?: number;
  randomizeQuestions?: boolean;
  showResults?: boolean;
  isPublished?: boolean;
  questions?: Question[];
}

export type QuizListFilters = {
  page?: number;
  perPage?: number;
  course?: string;
  module?: string;
  lesson?: string;
  isPublished?: boolean;
};

// Fetch functions
export const fetchQuizzesList = async (filters: QuizListFilters = {}): Promise<QuizzesListResponse> => {
  const params: Record<string, string | number | boolean> = {
    page: filters.page || 1,
    perPage: filters.perPage || 30,
  };

  if (filters.course) params.course = filters.course;
  if (filters.module) params.module = filters.module;
  if (filters.lesson) params.lesson = filters.lesson;
  if (filters.isPublished !== undefined) params.isPublished = filters.isPublished;

  try {
    const response = await api.get('/v1/admin/quizzes', {
      headers: await authHeaders(),
      params,
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch quizzes');
    return json as QuizzesListResponse;
  } catch (error) {
    throw error;
  }
};

export const fetchQuizById = async (id: string): Promise<QuizDetailResponse> => {
  try {
    const response = await api.get(`/v1/admin/quizzes/${id}`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch quiz');
    return json as QuizDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const createQuiz = async (payload: CreateQuizPayload): Promise<QuizDetailResponse> => {
  try {
    const response = await api.post('/v1/admin/quizzes', {
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to create quiz');
    return json as QuizDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const updateQuiz = async (id: string, payload: UpdateQuizPayload): Promise<QuizDetailResponse> => {
  try {
    const response = await api.put(`/v1/admin/quizzes/${id}`, {
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to update quiz');
    return json as QuizDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const deleteQuiz = async (id: string): Promise<{ status: number; message: string }> => {
  try {
    const response = await api.delete(`/v1/admin/quizzes/${id}`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to delete quiz');
    return json;
  } catch (error) {
    throw error;
  }
};

export const publishQuiz = async (id: string): Promise<QuizDetailResponse> => {
  try {
    const response = await api.patch(`/v1/admin/quizzes/${id}/publish`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to publish quiz');
    return json as QuizDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const unpublishQuiz = async (id: string): Promise<QuizDetailResponse> => {
  try {
    const response = await api.patch(`/v1/admin/quizzes/${id}/unpublish`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to unpublish quiz');
    return json as QuizDetailResponse;
  } catch (error) {
    throw error;
  }
};

// React Query hooks
export const useQuizzesList = (filters: QuizListFilters = {}) => {
  return useQuery({
    queryKey: ['quizzes-list', filters],
    queryFn: () => fetchQuizzesList(filters),
    refetchOnMount: true,
  });
};

export const useQuizById = (id: string) => {
  return useQuery({
    queryKey: ['quiz', id],
    queryFn: () => fetchQuizById(id),
    refetchOnMount: true,
    enabled: !!id,
  });
};
