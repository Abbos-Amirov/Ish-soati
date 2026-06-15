import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Worker } from '../../workers/schemas/worker.schema';

export type SalaryDocument = Salary & Document;

export enum SalaryStatus {
  PENDING = 'pending',
  PAID = 'paid',
}

@Schema({ timestamps: true })
export class Salary {
  @Prop({ type: Types.ObjectId, ref: Worker.name, required: true, index: true })
  worker: Types.ObjectId;

  @Prop({ required: true })
  periodStart: Date;

  @Prop({ required: true })
  periodEnd: Date;

  /** e.g. "2026-06" — used to prevent duplicate payroll runs for the same month */
  @Prop({ required: true })
  periodLabel: string;

  @Prop({ required: true, default: 0 })
  normalHours: number;

  @Prop({ required: true, default: 0 })
  overtimeHours: number;

  @Prop({ required: true, default: 0 })
  hourlyRate: number;

  @Prop({ required: true, default: 0 })
  normalPay: number;

  @Prop({ required: true, default: 0 })
  overtimePay: number;

  @Prop({ required: true, default: 0 })
  totalPay: number;

  @Prop({ enum: SalaryStatus, default: SalaryStatus.PENDING })
  status: SalaryStatus;

  @Prop({ type: Date, default: null })
  paidAt: Date | null;
}

export const SalarySchema = SchemaFactory.createForClass(Salary);
SalarySchema.index({ worker: 1, periodLabel: 1 }, { unique: true });
