import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = './uploads/';

    if (req.baseUrl.includes('gallery')) {
      uploadPath += 'gallery/';
    } else if (req.baseUrl.includes('courses')) {
      uploadPath += 'courses/';
    } else if (req.baseUrl.includes('products')) {
      uploadPath += 'products/';
    } else {
      uploadPath += 'misc/';
    }

    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `aam-${uniqueSuffix}${ext}`);
  }
});

// File filter — images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|avif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files (JPEG, PNG, GIF, WebP, AVIF) are allowed'));
};

// Multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

// 3D model upload (GLB/GLTF)
const modelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/models/';
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `model-${uniqueSuffix}${ext}`);
  }
});

export const uploadModel = multer({
  storage: modelStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for 3D models
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/\.(glb|gltf)$/)) {
      return cb(null, true);
    }
    cb(new Error('Only GLB/GLTF 3D model files are allowed'));
  }
});
