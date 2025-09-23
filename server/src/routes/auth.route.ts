import express from "express";
import { authController } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", authController.register);
router.post("/refresh-token", authController.refreshToken);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
export default router;
