import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Hash password
export const hashPassword = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Generate JWT token
export const generateJWT = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};
