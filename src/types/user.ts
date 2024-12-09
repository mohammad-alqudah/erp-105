export interface User {
  id: string;
  username: string;
  email: string | null;
  first_name: string;
  last_name: string;
}

export interface UsersResponse {
  data: User[];
  status: boolean;
  detail: null | string;
}

export interface CreateUserData {
  username: string;
  password: string;
  email?: string;
  first_name: string;
  last_name: string;
}

export interface UpdateUserData extends Partial<CreateUserData> {
  is_active?: boolean;
  is_staff?: boolean;
}