// Interface for User
export interface IUser {
  id: number;
  email: string;
  password: string; // Assuming password is stored as a hashed string
  is_verified: boolean;
  verification_token: string;
}

export interface IUserInput {
  name: string;
  email: string;
  password: string;
}

export interface IUserOutput {
  id: number;
  email: string;
  is_verified: boolean;
}
