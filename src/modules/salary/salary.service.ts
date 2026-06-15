import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OVERTIME_MULTIPLIER } from '../work-hours/work-hours.constants';
import { WorkHoursService } from '../work-hours/work-hours.service';
import { WorkersService } from '../workers/workers.service';
import { GenerateSalaryDto } from './dto/generate-salary.dto';
import { Salary, SalaryDocument, SalaryStatus } from './schemas/salary.schema';
import { formatPeriodLabel } from './utils/period';

@Injectable()
export class SalaryService {
  constructor(
    @InjectModel(Salary.name) private readonly salaryModel: Model<SalaryDocument>,
    private readonly workersService: WorkersService,
    private readonly workHoursService: WorkHoursService,
  ) {}

  async generate(dto: GenerateSalaryDto): Promise<SalaryDocument> {
    const worker = await this.workersService.findById(dto.workerId);
    const periodStart = new Date(dto.periodStart);
    const periodEnd = new Date(dto.periodEnd);
    const hourlyRate = dto.hourlyRate ?? worker.hourlyRate;
    const periodLabel = formatPeriodLabel(periodStart);

    const existing = await this.salaryModel.findOne({ worker: worker._id, periodLabel });
    if (existing?.status === SalaryStatus.PAID) {
      throw new ConflictException("Bu davr uchun maosh allaqachon to'langan");
    }

    const { normalHours, overtimeHours } = await this.workHoursService.getHoursInRange(
      dto.workerId,
      periodStart,
      periodEnd,
    );

    const normalPay = parseFloat((normalHours * hourlyRate).toFixed(2));
    const overtimePay = parseFloat((overtimeHours * hourlyRate * OVERTIME_MULTIPLIER).toFixed(2));
    const totalPay = parseFloat((normalPay + overtimePay).toFixed(2));

    return this.salaryModel.findOneAndUpdate(
      { worker: worker._id, periodLabel },
      {
        worker: worker._id,
        periodStart,
        periodEnd,
        periodLabel,
        normalHours,
        overtimeHours,
        hourlyRate,
        normalPay,
        overtimePay,
        totalPay,
      },
      { new: true, upsert: true },
    );
  }

  async findAll(filter: { workerId?: string; status?: SalaryStatus }): Promise<SalaryDocument[]> {
    const query: Record<string, unknown> = {};
    if (filter.workerId) query.worker = new Types.ObjectId(filter.workerId);
    if (filter.status) query.status = filter.status;
    return this.salaryModel
      .find(query)
      .sort({ periodStart: -1 })
      .populate('worker', 'name employeeId position');
  }

  async findById(id: string): Promise<SalaryDocument> {
    const salary = await this.salaryModel
      .findById(id)
      .populate('worker', 'name employeeId position');
    if (!salary) throw new NotFoundException('Maosh topilmadi');
    return salary;
  }

  async findByWorker(workerId: string): Promise<SalaryDocument[]> {
    return this.salaryModel
      .find({ worker: new Types.ObjectId(workerId) })
      .sort({ periodStart: -1 });
  }

  async updateStatus(id: string, status: SalaryStatus): Promise<SalaryDocument> {
    const salary = await this.salaryModel.findById(id);
    if (!salary) throw new NotFoundException('Maosh topilmadi');
    salary.status = status;
    salary.paidAt = status === SalaryStatus.PAID ? new Date() : null;
    return salary.save();
  }

  async remove(id: string): Promise<void> {
    const res = await this.salaryModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Maosh topilmadi');
  }
}
