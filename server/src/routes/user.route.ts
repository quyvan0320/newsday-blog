import express from "express";
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/profile", authenticate, userController.userProfile);

export default router;
