import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WorkerDocument } from '../workers/schemas/worker.schema';
import { HistoryQueryDto } from './dto/history-query.dto';
import { WorkHoursService } from './work-hours.service';

@Controller('work-hours')
@UseGuards(JwtAuthGuard)
export class WorkHoursController {
  constructor(private readonly workHoursService: WorkHoursService) {}

  @Post('clock-in')
  clockIn(@CurrentUser() user: WorkerDocument) {
    return this.workHoursService.clockIn(user._id.toString());
  }

  @Post('clock-out')
  clockOut(@CurrentUser() user: WorkerDocument) {
    return this.workHoursService.clockOut(user._id.toString());
  }

  @Get('today')
  getToday(@CurrentUser() user: WorkerDocument) {
    return this.workHoursService.getToday(user._id.toString());
  }

  @Get('history')
  getHistory(@CurrentUser() user: WorkerDocument, @Query() query: HistoryQueryDto) {
    return this.workHoursService.getHistory(user._id.toString(), query.days);
  }

  @Get('weekly')
  getWeekly(@CurrentUser() user: WorkerDocument) {
    return this.workHoursService.getWeekly(user._id.toString());
  }

  @Get('monthly')
  getMonthly(@CurrentUser() user: WorkerDocument) {
    return this.workHoursService.getMonthly(user._id.toString());
  }
}
