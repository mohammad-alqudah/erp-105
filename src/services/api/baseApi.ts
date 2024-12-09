import axios, { AxiosInstance, AxiosError } from 'axios';

export interface ApiResponse<T> {
  data: T;
  status: boolean;
  detail: string | null;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  next: number | null;
  previous: number | null;
  count: number;
}

const createApi = (): AxiosInstance => {
  const api = axios.create({
    baseURL: localStorage.getItem('apiDomain') || 'https://demo.s3r.store',
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export const api = createApi();