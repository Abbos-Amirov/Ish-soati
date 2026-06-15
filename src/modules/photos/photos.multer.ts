import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { WorkerDocument } from '../workers/schemas/worker.schema';

export const PHOTOS_DIR = join(process.cwd(), 'uploads', 'photos');

export const photoMulterOptions = {
  storage: diskStorage({
    destination: PHOTOS_DIR,
    filename: (req: Request, file, cb) => {
      const user = req.user as WorkerDocument;
      const ext = extname(file.originalname);
      cb(null, `${user._id.toString()}-${Date.now()}${ext}`);
    },
  }),
  fileFilter: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, accept: boolean) => void) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new BadRequestException('Faqat rasm fayllari yuklanadi'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
};
