import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LeaveRequestStatus } from '../schemas/leave-request.schema';

export class UpdateLeaveRequestStatusDto {
  @IsEnum(LeaveRequestStatus)
  status: LeaveRequestStatus;

  @IsOptional()
  @IsString()
  response?: string;
}
