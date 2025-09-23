import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import jwt from "jsonwebtoken";
export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password)
        return res
          .status(400)
          .json({ success: false, message: "Hãy nhập đủ trường!" });

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser)
        return res
          .status(400)
          .json({ success: false, message: "Email đã tồn tại!" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { username, email, password: hashedPassword, role: "user" },
      });

      const accessToken = generateAccessToken(user.id, user.role);
      const refreshToken = generateRefreshToken(user.id, user.role);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(201).json({
        success: true,
        message: "User đã được tạo",
        user: {
          id: user.id,
          username: user.username,

          email: user.email,
        },
        accessToken,
      });
    } catch (error) {
      console.error("Lỗi khi đang tạo user: ", error);
      res.status(500).json({ success: false, message: "Lỗi server cục bộ" });
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        res.status(400).json({
          success: false,
          message: "Hãy nhập đủ trường email & mật khẩu!",
        });

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "Email không tồn tại!" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ success: false, message: "Mật khẩu không khớp!" });

      const accessToken = generateAccessToken(user.id, user.role);
      const refreshToken = generateRefreshToken(user.id, user.role);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công!",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        accessToken,
      });
    } catch (error) {
      console.error("Lỗi khi đang đăng nhập user: ", error);
      res.status(500).json({ success: false, message: "Lỗi server cục bộ" });
    }
  },
  logout: async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.sendStatus(204);

      await prisma.user.updateMany({
        where: { refreshToken },
        data: { refreshToken: null },
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res.json({ success: true, message: "Đăng xuất thành công" });
    } catch (error) {
      console.error("Lỗi khi đang đăng xuất user: ", error);
      res.status(500).json({ success: false, message: "Lỗi server cục bộ" });
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    try {
      const token = req.cookies.refreshToken;
      if (!token)
        return res
          .status(401)
          .json({ success: false, message: "Chưa có refresh token!" });

      const user = await prisma.user.findFirst({
        where: { refreshToken: token },
      });
      if (!user)
        return res
          .status(401)
          .json({ success: false, message: "Refresh token không hợp lệ!" });

      jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET!,
        (err: any, decoded: any) => {
          if (err)
            return res
              .status(403)
              .json({ success: false, message: "Refresh token hết hạn!" });
          const accessToken = generateAccessToken(user.id, user.role);
          return res.json({ success: true, accessToken });
        }
      );
    } catch (error) {
      console.error("Lỗi refresh token: ", error);
      res.status(500).json({ success: false, message: "Lỗi server cục bộ" });
    }
  },
};
