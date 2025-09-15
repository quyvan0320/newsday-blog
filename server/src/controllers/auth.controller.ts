import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import generateToken from "../utils/jwt";
export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password)
        return res
          .status(400)
          .json({ success: false, message: "Hãy nhập đủ trường!" });

      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
      });

      if (existingUser)
        return res
          .status(400)
          .json({ success: false, message: "User đã tồn tại!" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: { username, email, password: hashedPassword },
      });

      const token = generateToken(newUser.id);
      res
        .status(201)
        .json({
          success: true,
          message: "User đã được tạo",
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
          },
          token,
        });
    } catch (error) {
      console.error("Lỗi khi đang tạo user: ", error);
      res.status(500).json({ success: false, message: "Lỗi server cục bộ" });
    }
  },
};
