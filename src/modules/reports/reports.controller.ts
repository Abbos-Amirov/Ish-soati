import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { DailyReportQueryDto } from './dto/daily-report-query.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.reportsService.getDashboardStats();
  }

  @Get('daily')
  getDaily(@Query() query: DailyReportQueryDto) {
    return this.reportsService.getDailyReport(query.date);
  }

  @Get('weekly')
  getWeekly() {
    return this.reportsService.getWeeklyReport();
  }

  @Get('monthly')
  getMonthly() {
    return this.reportsService.getMonthlyReport();
  }

  @Get('worker/:id')
  getWorkerDetail(@Param('id') id: string) {
    return this.reportsService.getWorkerDetail(id);
  }
}
