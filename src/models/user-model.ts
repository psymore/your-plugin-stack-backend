// Interface for User
export interface User {
  id: number;
  email: string;
  password: string; // Assuming password is stored as a hashed string
  is_verified: boolean;
  verification_token: string;
}
