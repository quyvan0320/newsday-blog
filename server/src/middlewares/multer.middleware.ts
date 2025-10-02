import multer, { memoryStorage } from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadAvatar = upload.single("avatar");
