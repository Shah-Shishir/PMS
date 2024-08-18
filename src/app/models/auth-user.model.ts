export interface AuthUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  genderId: number;
  dob: string | null;
}
