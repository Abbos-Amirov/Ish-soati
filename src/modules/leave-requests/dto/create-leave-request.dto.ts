import { IsEnum, IsISO8601, IsOptional, IsString, MinLength } from 'class-validator';
import { LeaveRequestType } from '../schemas/leave-request.schema';

export class CreateLeaveRequestDto {
  @IsEnum(LeaveRequestType)
  type: LeaveRequestType;

  @IsISO8601()
  startDate: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @IsString()
  @MinLength(10)
  reason: string;
}
