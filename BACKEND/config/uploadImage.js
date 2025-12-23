const cloudinary = require("cloudinary").v2;

async function uploadImage(imagePath) {
  if (!imagePath) {
    throw new Error("Image path is required");
  }

  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "ecommerce",
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error; 
  }
}

async function deleteImage(imageId) {
  if (!imageId) {
    throw new Error("Image id is required");
  }

  try {
    return await cloudinary.uploader.destroy(imageId);
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
    throw error;
  }
}

module.exports = { uploadImage, deleteImage };
