import { IsEnum, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Role } from '../../../common/enums/role.enum';

export class UpdateWorkerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  password?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;
}
