import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Dynamic folder based on route
const makeStorage = (folder) => new CloudinaryStorage({
  cloudinary,
  params: {
    folder: `aam/${folder}`,
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  },
});

// File filter — images only
const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|avif/;
  if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP, AVIF)'));
  }
};

export const upload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: (req) => {
      let folder = 'misc';
      if (req.baseUrl?.includes('gallery'))  folder = 'gallery';
      if (req.baseUrl?.includes('courses'))  folder = 'courses';
      if (req.baseUrl?.includes('products')) folder = 'products';
      return {
        folder: `aam/${folder}`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'],
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      };
    },
  }),
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// 3D model upload — memory storage (no Cloudinary for GLB)
export const uploadModel = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/\.(glb|gltf)$/)) return cb(null, true);
    cb(new Error('Only GLB/GLTF files are allowed'));
  },
});
