import { v2 as cloudinary } from 'cloudinary';

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error('CLOUDINARY_CLOUD_NAME is not defined');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper untuk upload file
export const uploadToCloudinary = async (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: 'uploads',
      resource_type: 'auto',
      timestamp: Math.floor(Date.now() / 1000),
      ...options,
    };
    
    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      })
      .end(fileBuffer);
  });
};

// Helper untuk delete file
export const deleteFromCloudinary = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

// Helper untuk mendapatkan file info
export const getFileInfo = async (publicId) => {
  return cloudinary.api.resource(publicId);
};

// Helper untuk mendapatkan signed URL
export const getSignedUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    secure: true,
    sign_url: true,
    ...options,
  });
};

// Helper untuk mengecek tipe file
export const getFileType = (resourceType, format) => {
  const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  const videoFormats = ['mp4', 'webm', 'mov', 'avi', 'mkv'];
  const audioFormats = ['mp3', 'wav', 'ogg', 'm4a'];
  const documentFormats = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
  const archiveFormats = ['zip', 'rar', '7z', 'tar', 'gz'];
  
  if (resourceType === 'image' || imageFormats.includes(format?.toLowerCase())) {
    return 'image';
  } else if (resourceType === 'video' || videoFormats.includes(format?.toLowerCase())) {
    return 'video';
  } else if (resourceType === 'raw' && audioFormats.includes(format?.toLowerCase())) {
    return 'audio';
  } else if (resourceType === 'raw' && documentFormats.includes(format?.toLowerCase())) {
    return 'document';
  } else if (resourceType === 'raw' && archiveFormats.includes(format?.toLowerCase())) {
    return 'archive';
  } else {
    return 'other';
  }
};

export default cloudinary;
