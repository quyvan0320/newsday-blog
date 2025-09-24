import { Request, Response } from "express";
import prisma from "../lib/prisma";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const userController = {
  userProfile: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId)
        return res
          .status(400)
          .json({ success: false, message: "Chưa đăng nhập!" });
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          avatar_url: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "Không tìm thấy user!" });

      res.status(200).json({ success: true, user });
    } catch (error) {
      console.error("Lỗi khi lấy profile: ", error);
      res.status(500).json({ success: false, message: "Lỗi server cục bộ" });
    }
  },
};
