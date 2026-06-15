import { IsEnum } from 'class-validator';
import { SalaryStatus } from '../schemas/salary.schema';

export class UpdateSalaryStatusDto {
  @IsEnum(SalaryStatus)
  status: SalaryStatus;
}
