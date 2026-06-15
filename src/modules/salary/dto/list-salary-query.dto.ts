import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { SalaryStatus } from '../schemas/salary.schema';

export class ListSalaryQueryDto {
  @IsOptional()
  @IsMongoId()
  workerId?: string;

  @IsOptional()
  @IsEnum(SalaryStatus)
  status?: SalaryStatus;
}
