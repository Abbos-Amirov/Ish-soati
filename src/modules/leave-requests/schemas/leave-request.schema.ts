import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum LeaveRequestType {
  ANNUAL = 'annual',
  SICK = 'sick',
  UNPAID = 'unpaid',
  PERSONAL = 'personal',
}

export enum LeaveRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class LeaveRequest {
  @Prop({ type: Types.ObjectId, ref: 'Worker', required: true })
  workerId: Types.ObjectId | Worker;

  @Prop({ required: true, enum: Object.values(LeaveRequestType) })
  type: LeaveRequestType;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  reason?: string;

  @Prop({ default: LeaveRequestStatus.PENDING, enum: Object.values(LeaveRequestStatus) })
  status: LeaveRequestStatus;

  @Prop()
  approvedBy?: Types.ObjectId;

  @Prop()
  approvalDate?: Date;

  @Prop()
  response?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type LeaveRequestDocument = LeaveRequest & Document;
export const LeaveRequestSchema = SchemaFactory.createForClass(LeaveRequest);
