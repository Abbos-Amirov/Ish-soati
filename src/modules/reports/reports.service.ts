import { Injectable } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';
import { PhotosService } from '../photos/photos.service';
import { WorkHourStatus } from '../work-hours/schemas/work-hour.schema';
import { calcWeeklyHours } from '../work-hours/utils/time-calc';
import { WorkHoursService } from '../work-hours/work-hours.service';
import { WorkersService } from '../workers/workers.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly workersService: WorkersService,
    private readonly workHoursService: WorkHoursService,
    private readonly photosService: PhotosService,
  ) {}

  async getDailyReport(date?: string) {
    const workers = await this.workersService.findAll(Role.WORKER);
    const logs = await this.workHoursService.findLogsForDate(date);

    return workers.map((worker) => {
      const log = logs.find((l) => l.worker.toString() === worker._id.toString());
      return {
        workerId: worker._id,
        name: worker.name,
        employeeId: worker.employeeId,
        position: worker.position,
        clockIn: log?.clockIn ?? null,
        clockOut: log?.clockOut ?? null,
        normalHours: log?.normalHours ?? 0,
        overtimeHours: log?.overtimeHours ?? 0,
        status: log?.status ?? 'absent',
      };
    });
  }

  async getWeeklyReport() {
    const workers = await this.workersService.findAll(Role.WORKER);
    const logs = await this.workHoursService.findCompletedLogsSince(7);

    return workers.map((worker) => {
      const workerLogs = logs.filter((l) => l.worker.toString() === worker._id.toString());
      const weekly = calcWeeklyHours(workerLogs);
      return {
        workerId: worker._id,
        name: worker.name,
        employeeId: worker.employeeId,
        ...weekly,
        daysWorked: workerLogs.length,
      };
    });
  }

  async getMonthlyReport() {
    const workers = await this.workersService.findAll(Role.WORKER);
    const logs = await this.workHoursService.findCompletedLogsSince(30);

    return workers.map((worker) => {
      const workerLogs = logs.filter((l) => l.worker.toString() === worker._id.toString());
      const totalNormal = workerLogs.reduce((s, l) => s + l.normalHours, 0);
      const totalOvertime = workerLogs.reduce((s, l) => s + l.overtimeHours, 0);
      return {
        workerId: worker._id,
        name: worker.name,
        employeeId: worker.employeeId,
        totalWorked: parseFloat((totalNormal + totalOvertime).toFixed(2)),
        normalHours: parseFloat(totalNormal.toFixed(2)),
        overtimeHours: parseFloat(totalOvertime.toFixed(2)),
        daysWorked: workerLogs.length,
      };
    });
  }

  async getDashboardStats() {
    const workers = await this.workersService.findAll(Role.WORKER);
    const todayLogs = await this.workHoursService.findLogsForDate();

    const active = todayLogs.filter((l) => l.status === WorkHourStatus.ACTIVE).length;
    const completed = todayLogs.filter((l) => l.status === WorkHourStatus.COMPLETED).length;
    const absent = workers.length - todayLogs.length;

    const weekReport = await this.getWeeklyReport();
    const totalWeekHours = weekReport.reduce((s, w) => s + w.totalWorked, 0);
    const totalOvertime = weekReport.reduce((s, w) => s + w.weeklyOvertime, 0);

    return {
      totalWorkers: workers.length,
      activeToday: active,
      completedToday: completed,
      absentToday: absent,
      totalWeekHours: parseFloat(totalWeekHours.toFixed(2)),
      totalOvertime: parseFloat(totalOvertime.toFixed(2)),
    };
  }

  async getWorkerDetail(workerId: string) {
    const worker = await this.workersService.findById(workerId);
    const stats = await this.workHoursService.getWorkerStats(workerId);
    const logs = await this.workHoursService.findRecentLogsForWorker(workerId, 30);
    const photos = await this.photosService.findRecentForWorker(workerId, 10);

    return { user: worker.toJSON(), stats, logs, photos };
  }
}
