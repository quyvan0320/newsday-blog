import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export const decodedToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as {
    userId: string;
    role: string;
  };
};

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res
        .status(401)
        .json({ success: false, message: "Không có token!" });

    const token = authHeader.split(" ")[1];
    const decoded = decodedToken(token);
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    console.error("JWT decoded error: ", error);
    return res
      .status(403)
      .json({ success: false, message: "Token không hợp lệ" });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin")
    return res
      .status(403)
      .json({ success: false, message: "Bạn không có quyền admin!" });
  next();
};
