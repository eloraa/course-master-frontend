export type UserRole = 'admin' | 'student';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accessToken: string;
  tokenType: string;
};
