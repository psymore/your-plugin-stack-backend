export interface Auth {
  name?: string;
  email: string;
  password: string; // Assuming password is stored as a hashed string
  is_verified: boolean;
}

export interface AuthInput {
  name?: string;
  email: string;
  password: string;
}
