import { Request, Response } from "express";

export const authController = {
  createAuth: async (req: Request, res: Response) => {
    try {
      
    } catch (error) {
      console.error("Lỗi khi đang tạo user: ", error);
      res.status(500).json({ success: false, message: "Lỗi server cục bộ" });
    }
  },
};
