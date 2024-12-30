export interface Auth {
  id: number;
  email: string;
  password: string; // Assuming password is stored as a hashed string
  is_verified: boolean;
  verification_token: string;
}

export interface AuthInput {
  email: string;
  password: string;
}

export interface AuthOutput {
  id: number;
  email: string;
  is_verified: boolean;
}
