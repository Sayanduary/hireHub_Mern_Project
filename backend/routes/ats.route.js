import express from 'express';
import multer from 'multer';
import { checkATSScore } from '../controllers/ats.controller.js';

const router = express.Router();

// Configure multer for memory storage (don't save to disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'), false);
    }
  },
});

// POST /api/v1/ats/check - Check ATS Score
router.post('/check', upload.single('resume'), checkATSScore);

export default router;
