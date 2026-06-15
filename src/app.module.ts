import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { LeaveRequestsModule } from './modules/leave-requests/leave-requests.module';
import { PhotosModule } from './modules/photos/photos.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SalaryModule } from './modules/salary/salary.module';
import { WorkHoursModule } from './modules/work-hours/work-hours.module';
import { WorkersModule } from './modules/workers/workers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('mongodbUri'),
      }),
    }),
    AuthModule,
    WorkersModule,
    WorkHoursModule,
    SalaryModule,
    ReportsModule,
    PhotosModule,
    LeaveRequestsModule,
  ],
})
export class AppModule {}
