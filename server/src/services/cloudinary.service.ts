import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME_CLOUDINARY,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_SECRET_CLOUDINARY,
});

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string,
  preset: string
) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, upload_preset: preset }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(fileBuffer);
  });
};
