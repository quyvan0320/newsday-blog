import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (
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
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
    };
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
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
