import { IsDateString, IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';

export class GenerateSalaryDto {
  @IsMongoId()
  workerId: string;

  @IsDateString()
  periodStart: string;

  @IsDateString()
  periodEnd: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;
}
