import { api, PaginatedResponse, ApiResponse } from './baseApi';
import { User, CreateUserData, UpdateUserData } from '../../types/user';
import { createFormData } from '../../utils/formData';

export const getUsers = async (page = 1): Promise<PaginatedResponse<User>> => {
  const response = await api.get<PaginatedResponse<User>>(`/auth/users/?page=${page}`);
  return response.data;
};

export const createUser = async (userData: CreateUserData): Promise<ApiResponse<User>> => {
  const formData = createFormData(userData);
  const response = await api.post<ApiResponse<User>>('/auth/users/', formData);
  return response.data;
};

export const updateUser = async (id: string, userData: UpdateUserData): Promise<ApiResponse<User>> => {
  const formData = createFormData(userData);
  const response = await api.put<ApiResponse<User>>(`/auth/users/${id}/`, formData);
  return response.data;
};

export const deleteUser = async (id: string): Promise<ApiResponse<string>> => {
  const response = await api.delete<ApiResponse<string>>(`/auth/users/${id}/`);
  return response.data;
};