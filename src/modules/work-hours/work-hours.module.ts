import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkHour, WorkHourSchema } from './schemas/work-hour.schema';
import { WorkHoursController } from './work-hours.controller';
import { WorkHoursService } from './work-hours.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: WorkHour.name, schema: WorkHourSchema }])],
  controllers: [WorkHoursController],
  providers: [WorkHoursService],
  exports: [WorkHoursService],
})
export class WorkHoursModule {}
