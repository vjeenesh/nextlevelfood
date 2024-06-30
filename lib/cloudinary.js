import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "nextlevelfood",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

async function uploadImage(bufferedImage) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: "image", folder: "nextlevelfood" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.url);
          }
        }
      )
      .end(Buffer.from(bufferedImage));
  });
}

export { storage, cloudinary, uploadImage };
