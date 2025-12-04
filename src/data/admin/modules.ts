import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { authHeaders } from '@/lib/api';

// Type definitions
export interface Module {
  id: string;
  title: string;
  description?: string;
  course: string;
  order: number;
  isPublished: boolean;
  lessonCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ModulesListResponse {
  status: number;
  message: string;
  data: Module[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface ModuleDetailResponse {
  status: number;
  message: string;
  data: Module;
}

export interface CreateModulePayload {
  title: string;
  description?: string;
  course: string;
  order: number;
  isPublished?: boolean;
}

export interface UpdateModulePayload {
  title?: string;
  description?: string;
  order?: number;
  isPublished?: boolean;
}

export type ModuleListFilters = {
  page?: number;
  perPage?: number;
  course?: string;
  isPublished?: boolean;
};

// Fetch functions
export const fetchModulesList = async (filters: ModuleListFilters = {}): Promise<ModulesListResponse> => {
  const params: Record<string, string | number | boolean> = {
    page: filters.page || 1,
    perPage: filters.perPage || 30,
  };

  if (filters.course) params.course = filters.course;
  if (filters.isPublished !== undefined) params.isPublished = filters.isPublished;

  try {
    const response = await api.get('/v1/admin/modules', {
      headers: await authHeaders(),
      params,
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch modules');
    return json as ModulesListResponse;
  } catch (error) {
    throw error;
  }
};

export const fetchModuleById = async (id: string): Promise<ModuleDetailResponse> => {
  try {
    const response = await api.get(`/v1/admin/modules/${id}`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch module');
    return json as ModuleDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const createModule = async (payload: CreateModulePayload): Promise<ModuleDetailResponse> => {
  try {
    const response = await api.post('/v1/admin/modules', {
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to create module');
    return json as ModuleDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const updateModule = async (id: string, payload: UpdateModulePayload): Promise<ModuleDetailResponse> => {
  try {
    const response = await api.put(`/v1/admin/modules/${id}`, {
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to update module');
    return json as ModuleDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const deleteModule = async (id: string): Promise<{ status: number; message: string }> => {
  try {
    const response = await api.delete(`/v1/admin/modules/${id}`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to delete module');
    return json;
  } catch (error) {
    throw error;
  }
};

// React Query hooks
export const useModulesList = (filters: ModuleListFilters = {}) => {
  return useQuery({
    queryKey: ['modules-list', filters],
    queryFn: () => fetchModulesList(filters),
    refetchOnMount: true,
  });
};

export const useModuleById = (id: string) => {
  return useQuery({
    queryKey: ['module', id],
    queryFn: () => fetchModuleById(id),
    refetchOnMount: true,
    enabled: !!id,
  });
};
