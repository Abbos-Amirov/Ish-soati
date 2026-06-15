import { Module } from '@nestjs/common';
import { PhotosModule } from '../photos/photos.module';
import { WorkHoursModule } from '../work-hours/work-hours.module';
import { WorkersModule } from '../workers/workers.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [WorkersModule, WorkHoursModule, PhotosModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
