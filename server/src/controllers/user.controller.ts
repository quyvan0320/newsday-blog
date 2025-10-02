import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { uploadToCloudinary } from "../services/cloudinary.service";

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
          bio: true,
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
      console.error("Lỗi khi lấy hồ sơ: ", error);
      res.status(500).json({ success: false, message: "Lỗi server cục bộ" });
    }
  },
  updateProfile: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { username, email, bio } = req.body;
      if (!userId)
        return res
          .status(400)
          .json({ success: false, message: "Chưa đăng nhập!" });

      if (email) {
        const emailExist = await prisma.user.findFirst({
          where: { email, NOT: { id: userId } },
        });
        if (emailExist)
          return res
            .status(401)
            .json({ success: false, message: "Email đã tồn tại!" });
      }

      let avatar: string;
      if (req.file) {
        const result = await uploadToCloudinary(
          req.file.buffer,
          "avatars",
          "newsdayblog_avatar"
        );
        avatar = (result as any).secure_url;
      }

      const updateProfile = await prisma.user.update({
        where: { id: userId },
        data: { username, email, avatar_url: avatar, bio },
        select: {
          username: true,
          email: true,
          avatar_url: true,
          bio: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Cập nhật thành công",
        user: updateProfile,
      });
    } catch (error) {
      console.error("Lỗi khi lấy hồ sơ: ", error);
      res.status(500).json({ success: false, message: "Lỗi server cục bộ" });
    }
  },
};
