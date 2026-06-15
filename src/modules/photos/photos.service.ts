import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as fs from 'fs';
import { join } from 'path';
import { endOfDay, startOfDay } from '../work-hours/utils/time-calc';
import { Photo, PhotoDocument } from './schemas/photo.schema';
import { PHOTOS_DIR } from './photos.multer';

@Injectable()
export class PhotosService {
  constructor(@InjectModel(Photo.name) private readonly photoModel: Model<PhotoDocument>) {}

  async upload(workerId: string, file: Express.Multer.File): Promise<PhotoDocument> {
    const now = new Date();
    const existing = await this.photoModel.findOne({
      worker: new Types.ObjectId(workerId),
      date: { $gte: startOfDay(now), $lte: endOfDay(now) },
    });

    const url = `/uploads/photos/${file.filename}`;

    if (existing) {
      this.removeFile(existing.filename);
      existing.url = url;
      existing.filename = file.filename;
      existing.date = now;
      return existing.save();
    }

    return this.photoModel.create({
      worker: new Types.ObjectId(workerId),
      date: now,
      url,
      filename: file.filename,
    });
  }

  async getToday(workerId: string): Promise<PhotoDocument | null> {
    const now = new Date();
    return this.photoModel.findOne({
      worker: new Types.ObjectId(workerId),
      date: { $gte: startOfDay(now), $lte: endOfDay(now) },
    });
  }

  async findRecentForWorker(workerId: string, limit = 10): Promise<PhotoDocument[]> {
    return this.photoModel
      .find({ worker: new Types.ObjectId(workerId) })
      .sort({ date: -1 })
      .limit(limit);
  }

  private removeFile(filename: string) {
    fs.unlink(join(PHOTOS_DIR, filename), () => {});
  }
}
