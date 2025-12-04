import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { authHeaders } from '@/lib/api';

export type BatchStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';
export type LocationType = 'online' | 'offline' | 'hybrid';

export interface Schedule {
  days: string[];
  startTime: string;
  endTime: string;
  timeZone: string;
}

export interface Location {
  type: LocationType;
  virtualLink?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
}

export interface BatchData {
  id: string;
  name: string;
  description?: string;
  course: Course;
  startDate: string;
  endDate?: string;
  capacity: number;
  enrolledCount: number;
  availableSpots: number;
  isFull: boolean;
  occupancyRate: number;
  priceOverride?: number;
  currency: string;
  status: BatchStatus;
  isPublished: boolean;
  schedule?: Schedule;
  location?: Location;
  instructor?: Instructor;
  requirements?: string[];
  materials?: string[];
  certificate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BatchListResponse {
  status: number;
  message: string;
  data: BatchData[];
  pagination?: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface BatchDetailResponse {
  status: number;
  message: string;
  data: BatchData;
}

export interface CreateBatchPayload {
  name: string;
  description?: string;
  course: string;
  startDate: string;
  endDate?: string;
  capacity?: number;
  priceOverride?: number;
  currency?: string;
  status?: BatchStatus;
  isPublished?: boolean;
  schedule?: Schedule;
  location?: Location;
  instructor?: string;
  requirements?: string[];
  materials?: string[];
  certificate?: boolean;
}

export interface UpdateBatchPayload {
  name?: string;
  description?: string;
  capacity?: number;
  priceOverride?: number;
  status?: BatchStatus;
  isPublished?: boolean;
  course?: string;
}

export type BatchListFilters = {
  page?: number;
  perPage?: number;
  course?: string;
  status?: BatchStatus;
  isPublished?: boolean;
  search?: string;
};

// Fetch functions
export const fetchBatchesByCourse = async (courseId: string, filters: BatchListFilters = {}): Promise<BatchListResponse> => {
  const params: Record<string, string | number | boolean> = {
    page: filters.page || 1,
    perPage: filters.perPage || 30,
  };

  if (filters.status) params.status = filters.status;
  if (filters.isPublished !== undefined) params.isPublished = filters.isPublished;
  if (filters.search) params.search = filters.search;

  try {
    const response = await api.get(`/v1/admin/batches/courses/${courseId}`, {
      headers: await authHeaders(),
      params,
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch batches');
    return json as BatchListResponse;
  } catch (error) {
    throw error;
  }
};

export const fetchBatchById = async (id: string): Promise<BatchDetailResponse> => {
  try {
    const response = await api.get(`/v1/admin/batches/${id}`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to fetch batch');
    return json as BatchDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const createBatch = async (payload: CreateBatchPayload): Promise<BatchDetailResponse> => {
  try {
    const response = await api.post('/v1/admin/batches', {
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to create batch');
    return json as BatchDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const updateBatch = async (id: string, payload: UpdateBatchPayload): Promise<BatchDetailResponse> => {
  try {
    const response = await api.put(`/v1/admin/batches/${id}`, {
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to update batch');
    return json as BatchDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const deleteBatch = async (id: string): Promise<{ status: number; message: string }> => {
  try {
    const response = await api.delete(`/v1/admin/batches/${id}`, {
      headers: await authHeaders(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to delete batch');
    return json;
  } catch (error) {
    throw error;
  }
};

export const publishBatch = async (id: string): Promise<BatchDetailResponse> => {
  try {
    const response = await api.patch(`/v1/admin/batches/${id}/publish`, {
      headers: await authHeaders(),
      body: JSON.stringify({}),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to publish batch');
    return json as BatchDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const unpublishBatch = async (id: string): Promise<BatchDetailResponse> => {
  try {
    const response = await api.patch(`/v1/admin/batches/${id}/unpublish`, {
      headers: await authHeaders(),
      body: JSON.stringify({}),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to unpublish batch');
    return json as BatchDetailResponse;
  } catch (error) {
    throw error;
  }
};

export const updateBatchStatus = async (id: string, status: BatchStatus): Promise<BatchDetailResponse> => {
  try {
    const response = await api.patch(`/v1/admin/batches/${id}/status`, {
      headers: await authHeaders(),
      body: JSON.stringify({ status }),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || 'Failed to update batch status');
    return json as BatchDetailResponse;
  } catch (error) {
    throw error;
  }
};

// React Query hooks
export const useBatchesByCourse = (courseId: string, filters: BatchListFilters = {}) => {
  return useQuery({
    queryKey: ['batches-by-course', courseId, filters],
    queryFn: () => fetchBatchesByCourse(courseId, filters),
    refetchOnMount: true,
    enabled: !!courseId,
  });
};

export const useBatchById = (id: string) => {
  return useQuery({
    queryKey: ['batch', id],
    queryFn: () => fetchBatchById(id),
    refetchOnMount: true,
    enabled: !!id,
  });
};
