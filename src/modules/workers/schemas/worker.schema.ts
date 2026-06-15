import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../../common/enums/role.enum';

export type WorkerDocument = Worker & Document;

@Schema({ timestamps: true })
export class Worker {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  employeeId: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ enum: Role, default: Role.WORKER })
  role: Role;

  @Prop()
  phone?: string;

  @Prop()
  position?: string;

  @Prop({ default: 0, min: 0 })
  hourlyRate: number;
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);

WorkerSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret: Record<string, any>) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});
