import express from "express";
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { uploadAvatar } from "../middlewares/multer.middleware";

const router = express.Router();

router.get("/profile", authenticate, userController.userProfile);
router.put(
  "/profile",
  authenticate,
  uploadAvatar,
  userController.updateProfile
);

export default router;
