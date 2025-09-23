import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE as string,
  } as SignOptions);
};

export const generateRefreshToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE as string, 
  } as SignOptions);
};
