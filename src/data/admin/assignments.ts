import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { authHeaders } from '@/lib/api';

// Type definitions
export type AssignmentType = 'text' | 'file' | 'link' | 'code';

export interface Attachment {
  name: string;
  url: string;
  type: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  course: string;
  module?: string;
  lesson?: string;
  type: AssignmentType;
  maxScore: number;
  passingScore: number;
  dueDate?: string;
  allowLateSubmission: boolean;
  latePenalty?: number;
  attachments?: Attachment[];
  autoGrade: boolean;
  gradingCriteria?: string;
  isPublished: boolean;
  submissionCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface AssignmentsListResponse {
  status: number;
  message: string;
  data: Assignment[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface AssignmentDetailResponse {
  status: number;
  message: string;
  data: Assignment;
}

export interface CreateAssignmentPayload {
  title: string;
  description: string;
  instructions: string;
  course: string;
  module?: string;
  lesson?: string;
  type: AssignmentType;
  maxScore: number;
  passingScore: number;
  dueDate?: string;
  allowLateSubmission?: boolean;
  latePenalty?: number;
  attachments?: Attachment[];
  autoGrade?: boolean;
  gradingCriteria?: string;
  isPublished?: boolean;
}

export interface UpdateAssignmentPayload {
  title?: string;
  description?: string;
  instructions?: string;
  type?: AssignmentType;
  maxScore?: number;
  passingScore?: number;
  dueDate?: string;
  allowLateSubmission?: boolean;
  latePenalty?: number;
  attachments?: Attachment[];
  autoGrade?: boolean;
  gradingCriteria?: string;
  isPublished?: boolean;
}

export type AssignmentListFilters = {
  page?: number;
  perPage?: number;
  course?: string;
  module?: string;
  isPublished?: boolean;
};

// Fetch functions
export const fetchAssignmentsList = async (filters: AssignmentListFilters = {}): Promise<AssignmentsListResponse> => {
  const params: Record<string, string | number | boolean> = {
    page: filters.page || 1,
    perPage: filters.perPage || 30,
  };

  if (filters.course) params.course = filters.course;
  if (filters.module) params.module = filters.module;
  if (filters.isPublished !== undefined) params.isPublished = filters.isPublished;

  try {
    const response = await api.get('/v1/admin/assignments', {
      headers: await authHeaders(),
      params,
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch assignments');
    return json as AssignmentsListResponse;
  } catch (error) {
    throw error;
  }
};

export const fetchAssignmentById = async (id: string): Promise<AssignmentDetailResponse> => {
  try {
    const response = await api.get(`/v1/admin/assignments/${id}`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch assignment');
    return json as AssignmentDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const createAssignment = async (payload: CreateAssignmentPayload): Promise<AssignmentDetailResponse> => {
  try {
    const response = await api.post('/v1/admin/assignments', {
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to create assignment');
    return json as AssignmentDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const updateAssignment = async (id: string, payload: UpdateAssignmentPayload): Promise<AssignmentDetailResponse> => {
  try {
    const response = await api.put(`/v1/admin/assignments/${id}`, {
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to update assignment');
    return json as AssignmentDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const deleteAssignment = async (id: string): Promise<{ status: number; message: string }> => {
  try {
    const response = await api.delete(`/v1/admin/assignments/${id}`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to delete assignment');
    return json;
  } catch (error) {
    throw error;
  }
};

export const publishAssignment = async (id: string): Promise<AssignmentDetailResponse> => {
  try {
    const response = await api.patch(`/v1/admin/assignments/${id}/publish`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to publish assignment');
    return json as AssignmentDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const unpublishAssignment = async (id: string): Promise<AssignmentDetailResponse> => {
  try {
    const response = await api.patch(`/v1/admin/assignments/${id}/unpublish`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to unpublish assignment');
    return json as AssignmentDetailResponse;
  } catch (error) {
    throw error;
  }
};

// React Query hooks
export const useAssignmentsList = (filters: AssignmentListFilters = {}) => {
  return useQuery({
    queryKey: ['assignments-list', filters],
    queryFn: () => fetchAssignmentsList(filters),
    refetchOnMount: true,
  });
};

export const useAssignmentById = (id: string) => {
  return useQuery({
    queryKey: ['assignment', id],
    queryFn: () => fetchAssignmentById(id),
    refetchOnMount: true,
    enabled: !!id,
  });
};
