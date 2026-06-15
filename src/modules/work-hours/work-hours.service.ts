import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WorkHour, WorkHourDocument, WorkHourStatus } from './schemas/work-hour.schema';
import { calcDailyHours, calcWeeklyHours, daysAgo, endOfDay, startOfDay } from './utils/time-calc';

@Injectable()
export class WorkHoursService {
  constructor(
    @InjectModel(WorkHour.name) private readonly workHourModel: Model<WorkHourDocument>,
  ) {}

  private async findTodayLog(workerId: string): Promise<WorkHourDocument | null> {
    const now = new Date();
    return this.workHourModel.findOne({
      worker: new Types.ObjectId(workerId),
      date: { $gte: startOfDay(now), $lte: endOfDay(now) },
    });
  }

  async clockIn(workerId: string): Promise<WorkHourDocument> {
    const existing = await this.findTodayLog(workerId);
    if (existing?.status === WorkHourStatus.ACTIVE) {
      throw new ConflictException('Ish allaqachon boshlangan');
    }
    if (existing?.status === WorkHourStatus.COMPLETED) {
      throw new ConflictException('Bugun ish allaqachon tugagan');
    }

    const now = new Date();
    return this.workHourModel.create({
      worker: new Types.ObjectId(workerId),
      date: now,
      clockIn: now,
      clockOut: null,
      status: WorkHourStatus.ACTIVE,
    });
  }

  async clockOut(workerId: string): Promise<WorkHourDocument> {
    const log = await this.findTodayLog(workerId);
    if (!log || log.status !== WorkHourStatus.ACTIVE) {
      throw new BadRequestException('Faol ish topilmadi');
    }

    const now = new Date();
    const hours = calcDailyHours(log.clockIn, now);
    log.clockOut = now;
    log.normalHours = hours.normalHours;
    log.overtimeHours = hours.overtimeHours;
    log.totalWorked = hours.totalWorked;
    log.status = WorkHourStatus.COMPLETED;
    return log.save();
  }

  async getToday(workerId: string): Promise<WorkHourDocument | null> {
    return this.findTodayLog(workerId);
  }

  async getHistory(workerId: string, days = 7): Promise<WorkHourDocument[]> {
    return this.workHourModel
      .find({ worker: new Types.ObjectId(workerId), date: { $gte: daysAgo(days) } })
      .sort({ date: -1 });
  }

  async getWeekly(workerId: string) {
    const logs = await this.workHourModel.find({
      worker: new Types.ObjectId(workerId),
      date: { $gte: daysAgo(7) },
      status: WorkHourStatus.COMPLETED,
    });
    return calcWeeklyHours(logs);
  }

  async getMonthly(workerId: string) {
    const logs = await this.workHourModel.find({
      worker: new Types.ObjectId(workerId),
      date: { $gte: daysAgo(30) },
      status: WorkHourStatus.COMPLETED,
    });

    const totalNormal = logs.reduce((s, l) => s + l.normalHours, 0);
    const totalOvertime = logs.reduce((s, l) => s + l.overtimeHours, 0);

    return {
      totalWorked: parseFloat((totalNormal + totalOvertime).toFixed(2)),
      normalHours: parseFloat(totalNormal.toFixed(2)),
      overtimeHours: parseFloat(totalOvertime.toFixed(2)),
      daysWorked: logs.length,
    };
  }

  /** Aggregated normal/overtime hours for a worker within an arbitrary date range (used by salary calc). */
  async getHoursInRange(workerId: string, start: Date, end: Date) {
    const logs = await this.workHourModel.find({
      worker: new Types.ObjectId(workerId),
      date: { $gte: start, $lte: end },
      status: WorkHourStatus.COMPLETED,
    });

    const normalHours = logs.reduce((s, l) => s + l.normalHours, 0);
    const overtimeHours = logs.reduce((s, l) => s + l.overtimeHours, 0);

    return {
      normalHours: parseFloat(normalHours.toFixed(2)),
      overtimeHours: parseFloat(overtimeHours.toFixed(2)),
      daysWorked: logs.length,
    };
  }

  /** Summary stats for a single worker (used by the reports module for worker detail views). */
  async getWorkerStats(workerId: string) {
    const completed = await this.workHourModel.find({
      worker: new Types.ObjectId(workerId),
      status: WorkHourStatus.COMPLETED,
    });
    const weekly = completed.filter((l) => l.date >= daysAgo(7));

    const totalNormal = completed.reduce((s, l) => s + l.normalHours, 0);
    const totalOvertime = completed.reduce((s, l) => s + l.overtimeHours, 0);
    const weekNormal = weekly.reduce((s, l) => s + l.normalHours, 0);
    const weekOvertime = weekly.reduce((s, l) => s + l.overtimeHours, 0);

    const todayLog = await this.findTodayLog(workerId);

    return {
      todayLog,
      totalNormal: parseFloat(totalNormal.toFixed(2)),
      totalOvertime: parseFloat(totalOvertime.toFixed(2)),
      weekNormal: parseFloat(weekNormal.toFixed(2)),
      weekOvertime: parseFloat(weekOvertime.toFixed(2)),
      completedDays: completed.length,
    };
  }

  // ----- shared finders for the reports module -----

  async findLogsForDate(date?: string): Promise<WorkHourDocument[]> {
    const target = date ? new Date(date) : new Date();
    return this.workHourModel.find({
      date: { $gte: startOfDay(target), $lte: endOfDay(target) },
    });
  }

  async findCompletedLogsSince(days: number): Promise<WorkHourDocument[]> {
    return this.workHourModel.find({
      date: { $gte: daysAgo(days) },
      status: WorkHourStatus.COMPLETED,
    });
  }

  async findRecentLogsForWorker(workerId: string, limit = 30): Promise<WorkHourDocument[]> {
    return this.workHourModel
      .find({ worker: new Types.ObjectId(workerId) })
      .sort({ date: -1 })
      .limit(limit);
  }
}
