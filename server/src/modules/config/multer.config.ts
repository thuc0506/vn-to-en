// src/config/multer.config.ts
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      let uploadPath = './uploads/others';

      // ✅ Phân biệt rõ field
      if (file.fieldname === 'audio') {
        uploadPath = './uploads/audio';
      } else if (file.fieldname === 'audio_transcript') {
        uploadPath = './uploads/transcripts/audio';
      } else if (file.fieldname === 'video') {
        uploadPath = './uploads/video';
      } else if (file.fieldname === 'video_transcript') {
        uploadPath = './uploads/transcripts/video';
      }

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};
