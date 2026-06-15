import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Worker } from '../../workers/schemas/worker.schema';

export type WorkHourDocument = WorkHour & Document;

export enum WorkHourStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

@Schema({ timestamps: true })
export class WorkHour {
  @Prop({ type: Types.ObjectId, ref: Worker.name, required: true, index: true })
  worker: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  clockIn: Date;

  @Prop({ type: Date, default: null })
  clockOut: Date | null;

  @Prop({ default: 0 })
  normalHours: number;

  @Prop({ default: 0 })
  overtimeHours: number;

  @Prop({ default: 0 })
  totalWorked: number;

  @Prop({ enum: WorkHourStatus, default: WorkHourStatus.ACTIVE })
  status: WorkHourStatus;
}

export const WorkHourSchema = SchemaFactory.createForClass(WorkHour);
WorkHourSchema.index({ worker: 1, date: 1 });
