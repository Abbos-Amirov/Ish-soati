import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkHoursModule } from '../work-hours/work-hours.module';
import { WorkersModule } from '../workers/workers.module';
import { Salary, SalarySchema } from './schemas/salary.schema';
import { SalaryController } from './salary.controller';
import { SalaryService } from './salary.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Salary.name, schema: SalarySchema }]),
    WorkersModule,
    WorkHoursModule,
  ],
  controllers: [SalaryController],
  providers: [SalaryService],
})
export class SalaryModule {}
