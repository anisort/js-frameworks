export interface AuthUser {
  id: string;
  email: string;
  role: string;
  isConfirmed: boolean;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
