import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, authHeaders } from '@/lib/api';

// Type definitions
export interface SubmissionUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Submission {
  id: string;
  assignment: string;
  user: SubmissionUser;
  answer: string;
  submittedAt: string;
  isLate: boolean;
  reviewed: boolean;
  grade?: number | null;
  feedback?: string;
  reviewedAt?: string;
}

export interface SubmissionsListData {
  assignment: any;
  submissions: Submission[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface SubmissionsListResponse {
  status: number;
  message: string;
  data: SubmissionsListData;
}

export interface SubmissionDetailResponse {
  status: number;
  message: string;
  data: Submission;
}

export interface GradeSubmissionPayload {
  grade: number;
  feedback?: string;
}

export interface GradeSubmissionResponse {
  status: number;
  message: string;
  data: Submission;
}

export type SubmissionsListFilters = {
  page?: number;
  perPage?: number;
  reviewed?: boolean;
  isLate?: boolean;
};

// Fetch functions
export const fetchAssignmentSubmissions = async (
  assignmentId: string,
  filters: SubmissionsListFilters = {}
): Promise<SubmissionsListResponse> => {
  const params: Record<string, string | number | boolean> = {
    page: filters.page || 1,
    perPage: filters.perPage || 30,
  };

  if (filters.reviewed !== undefined) params.reviewed = filters.reviewed;
  if (filters.isLate !== undefined) params.isLate = filters.isLate;

  try {
    const response = await api.get(`/v1/admin/assignments/${assignmentId}/submissions`, {
      headers: await authHeaders(),
      params,
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch submissions');
    return json as SubmissionsListResponse;
  } catch (error) {
    throw error;
  }
};

export const fetchSubmissionById = async (assignmentId: string, submissionId: string): Promise<SubmissionDetailResponse> => {
  try {
    const response = await api.get(`/v1/admin/assignments/${assignmentId}/submissions/${submissionId}`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch submission');
    return json as SubmissionDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const gradeSubmission = async (
  assignmentId: string,
  submissionId: string,
  payload: GradeSubmissionPayload
): Promise<GradeSubmissionResponse> => {
  try {
    const response = await api.patch(`/v1/admin/assignments/${assignmentId}/submissions/${submissionId}/grade`, {
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to grade submission');
    return json as GradeSubmissionResponse;
  } catch (error) {
    throw error;
  }
};

// React Query hooks
export const useAssignmentSubmissions = (assignmentId: string, filters: SubmissionsListFilters = {}) => {
  return useQuery({
    queryKey: ['assignment-submissions', assignmentId, filters],
    queryFn: () => fetchAssignmentSubmissions(assignmentId, filters),
    refetchOnMount: true,
    enabled: !!assignmentId,
  });
};

export const useSubmissionById = (assignmentId: string, submissionId: string) => {
  return useQuery({
    queryKey: ['submission', assignmentId, submissionId],
    queryFn: () => fetchSubmissionById(assignmentId, submissionId),
    refetchOnMount: true,
    enabled: !!assignmentId && !!submissionId,
  });
};

export const useGradeSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assignmentId, submissionId, payload }: { assignmentId: string; submissionId: string; payload: GradeSubmissionPayload }) =>
      gradeSubmission(assignmentId, submissionId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignment-submissions', variables.assignmentId] });
      queryClient.setQueryData(['submission', variables.assignmentId, variables.submissionId], { data: data.data });
    },
  });
};
