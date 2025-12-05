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

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  questionId: string;
  title: string;
  type: 'multiple-choice' | 'true-false';
  content: string;
  options: QuestionOption[];
  points: number;
  order: number;
  userAnswer?: string;
  isCorrect?: boolean;
  earnedPoints?: number;
}

export interface QuizMetadata {
  attemptNumber: number;
  maxAttempts: number;
  timeLimit?: number;
  dueDate?: string;
}

export interface QuizSubmission {
  score: number;
  passed: boolean;
  submittedAt: string;
  timeTaken?: number;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  course: string;
  module: string;
  lesson: string;
  type: 'practice' | 'graded' | 'assessment';
  passingScore: number;
  totalPoints: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  showCorrectAnswers?: boolean;
  allowReview?: boolean;
  dueDate?: string;
  timeLimit?: number;
  maxAttempts: number;
  availableFrom?: string;
  availableUntil?: string;
  isPublished: boolean;
  submissionCount?: number;
  averageScore?: number;
  completed: boolean;
  submission?: QuizSubmission;
  questions: Question[];
  metadata: QuizMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface QuizResponse {
  status: number;
  message: string;
  data: Quiz;
}

export interface QuizSubmitResponse {
  status: number;
  message: string;
  data: {
    quizId: string;
    score: number;
    percentage: number;
    passed: boolean;
    earnedPoints: number;
    totalPoints: number;
    details: {
      totalQuestions: number;
      correctAnswers: number;
      timeTaken: number;
    };
    results: Array<{
      questionId: string;
      userAnswer: string;
      isCorrect: boolean;
      correctAnswer: string;
      points: number;
      earnedPoints: number;
    }>;
  };
}

export interface QuizResultsResponse {
  status: number;
  message: string;
  data: {
    quizId: string;
    submissions: Array<{
      attemptNumber: number;
      score: number;
      passed: boolean;
      submittedAt: string;
      timeTaken: number;
      details: {
        earnedPoints: number;
        totalPoints: number;
      };
    }>;
    bestScore: number;
    latestAttempt: {
      attemptNumber: number;
      score: number;
      passed: boolean;
      submittedAt: string;
      timeTaken: number;
      details: {
        earnedPoints: number;
        totalPoints: number;
      };
    };
  };
}

export interface AssignmentAttachment {
  name: string;
  url: string;
  type: string;
}

export interface AssignmentSubmission {
  answer: string;
  submittedAt: string;
  reviewed: boolean;
  grade: number | null;
  feedback?: string;
  isLate: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  course: string;
  module: string;
  lesson: string;
  type: 'text' | 'file' | 'link' | 'code';
  maxScore: number;
  passingScore: number;
  dueDate?: string;
  allowLateSubmission: boolean;
  latePenalty: number;
  attachments: AssignmentAttachment[];
  autoGrade: boolean;
  isPublished: boolean;
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
  submission?: AssignmentSubmission;
}

export interface AssignmentResponse {
  status: number;
  message: string;
  data: Assignment;
}

export interface AssignmentSubmitResponse {
  status: number;
  message: string;
  data: {
    assignmentId: string;
    submittedAt: string;
    isLate: boolean;
    maxScore: number;
    status: string;
    note?: string;
  };
}

export interface SubmissionStatusResponse {
  status: number;
  message: string;
  data: {
    assignmentId: string;
    submitted: boolean;
    submittedAt: string;
    reviewed: boolean;
    grade: number | null;
    feedback: string | null;
    isLate: boolean;
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

// Fetch quiz
export const fetchQuiz = async (courseId: string, quizId: string): Promise<QuizResponse> => {
  try {
    const response = await api.get(`/v1/me/courses/${courseId}/quizzes/${quizId}`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch quiz');
    return json as QuizResponse;
  } catch (error) {
    throw error;
  }
};

// Submit quiz
export const submitQuiz = async (
  courseId: string,
  quizId: string,
  answers: Record<string, string>,
  timeTaken: number
): Promise<QuizSubmitResponse> => {
  try {
    const response = await api.post(
      `/v1/me/courses/${courseId}/quizzes/${quizId}/submit`,
      {
        body: JSON.stringify({
          answers,
          timeTaken,
        }),
        headers: await authHeaders(),
      }
    );
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to submit quiz');
    return json as QuizSubmitResponse;
  } catch (error) {
    throw error;
  }
};

// Get quiz results
export const fetchQuizResults = async (courseId: string, quizId: string): Promise<QuizResultsResponse> => {
  try {
    const response = await api.get(`/v1/me/courses/${courseId}/quizzes/${quizId}/results`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch quiz results');
    return json as QuizResultsResponse;
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

export const useQuiz = (courseId: string, quizId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['quiz', courseId, quizId],
    queryFn: () => fetchQuiz(courseId, quizId),
    refetchOnMount: true,
    enabled: enabled && !!courseId && !!quizId,
  });
};

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      quizId,
      answers,
      timeTaken,
    }: {
      courseId: string;
      quizId: string;
      answers: Record<string, string>;
      timeTaken: number;
    }) => submitQuiz(courseId, quizId, answers, timeTaken),
    onSuccess: (data, variables) => {
      // Invalidate quiz and results
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.courseId, variables.quizId] });
      queryClient.invalidateQueries({ queryKey: ['quiz-results', variables.courseId, variables.quizId] });
      queryClient.invalidateQueries({ queryKey: ['enrollment-status', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
    },
  });
};

export const useQuizResults = (courseId: string, quizId: string) => {
  return useQuery({
    queryKey: ['quiz-results', courseId, quizId],
    queryFn: () => fetchQuizResults(courseId, quizId),
    refetchOnMount: true,
    enabled: !!courseId && !!quizId,
  });
};

// Fetch assignment
export const fetchAssignment = async (courseId: string, assignmentId: string): Promise<AssignmentResponse> => {
  try {
    const response = await api.get(`/v1/me/courses/${courseId}/assignments/${assignmentId}`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch assignment');
    return json as AssignmentResponse;
  } catch (error) {
    throw error;
  }
};

// Submit assignment
export const submitAssignment = async (
  courseId: string,
  assignmentId: string,
  answer: string
): Promise<AssignmentSubmitResponse> => {
  try {
    const response = await api.post(
      `/v1/me/courses/${courseId}/assignments/${assignmentId}/submit`,
      {
        body: JSON.stringify({
          answer,
        }),
        headers: await authHeaders(),
      }
    );
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to submit assignment');
    return json as AssignmentSubmitResponse;
  } catch (error) {
    throw error;
  }
};

// Get submission status
export const fetchSubmissionStatus = async (courseId: string, assignmentId: string): Promise<SubmissionStatusResponse> => {
  try {
    const response = await api.get(`/v1/me/courses/${courseId}/assignments/${assignmentId}/submission`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch submission status');
    return json as SubmissionStatusResponse;
  } catch (error) {
    throw error;
  }
};

// React Query hooks
export const useAssignment = (courseId: string, assignmentId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['assignment', courseId, assignmentId],
    queryFn: () => fetchAssignment(courseId, assignmentId),
    refetchOnMount: true,
    enabled: enabled && !!courseId && !!assignmentId,
  });
};

export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      assignmentId,
      answer,
    }: {
      courseId: string;
      assignmentId: string;
      answer: string;
    }) => submitAssignment(courseId, assignmentId, answer),
    onSuccess: (data, variables) => {
      // Invalidate assignment and submission status
      queryClient.invalidateQueries({ queryKey: ['assignment', variables.courseId, variables.assignmentId] });
      queryClient.invalidateQueries({ queryKey: ['submission-status', variables.courseId, variables.assignmentId] });
      queryClient.invalidateQueries({ queryKey: ['enrollment-status', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
    },
  });
};

export const useSubmissionStatus = (courseId: string, assignmentId: string) => {
  return useQuery({
    queryKey: ['submission-status', courseId, assignmentId],
    queryFn: () => fetchSubmissionStatus(courseId, assignmentId),
    refetchOnMount: true,
    enabled: !!courseId && !!assignmentId,
  });
};
