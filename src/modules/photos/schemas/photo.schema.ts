import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Worker } from '../../workers/schemas/worker.schema';

export type PhotoDocument = Photo & Document;

@Schema({ timestamps: true })
export class Photo {
  @Prop({ type: Types.ObjectId, ref: Worker.name, required: true, index: true })
  worker: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  filename: string;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
PhotoSchema.index({ worker: 1, date: 1 });
