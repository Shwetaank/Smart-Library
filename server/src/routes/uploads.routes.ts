import { Router } from 'express';
import multer from 'multer';
import { UploadController } from '../controllers/upload.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { createRateLimiter } from '../middlewares/rateLimit.js';
import { validateRequest } from '../middlewares/validate.js';
import { AppError } from '../utils/appError.js';
import { uploadFromUrlSchema } from '../validators/upload.validators.js';

const router = Router();
const uploadRateLimit = createRateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 60 });
const allowedCoverMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedCoverMimeTypes.has(file.mimetype)) {
      callback(new AppError('Only JPEG, PNG, and WebP cover images are allowed', 400));
      return;
    }

    callback(null, true);
  },
});

router.post(
  '/cover',
  uploadRateLimit,
  requireAuth,
  requireRole('LIBRARIAN', 'ADMIN'),
  upload.single('file'),
  (req, res, next) => req.container.resolve(UploadController).uploadCover(req, res, next),
);
router.post(
  '/cover/from-url',
  uploadRateLimit,
  requireAuth,
  requireRole('LIBRARIAN', 'ADMIN'),
  validateRequest(uploadFromUrlSchema),
  (req, res, next) => req.container.resolve(UploadController).uploadCoverFromUrl(req, res, next),
);
router.get(
  '/sas/:blobName',
  requireAuth,
  (req, res, next) => req.container.resolve(UploadController).getSasUrl(req, res, next),
);

export default router;
