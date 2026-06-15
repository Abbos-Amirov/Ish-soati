import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Role } from '../../common/enums/role.enum';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { Worker, WorkerDocument } from './schemas/worker.schema';

const SALT_ROUNDS = 10;

@Injectable()
export class WorkersService {
  constructor(@InjectModel(Worker.name) private workerModel: Model<WorkerDocument>) {}

  async create(dto: CreateWorkerDto): Promise<WorkerDocument> {
    const existing = await this.workerModel.findOne({ employeeId: dto.employeeId });
    if (existing) throw new ConflictException("Bu ID allaqachon mavjud");

    const password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const worker = new this.workerModel({
      ...dto,
      password,
      role: dto.role ?? Role.WORKER,
      hourlyRate: dto.hourlyRate ?? 0,
    });
    return worker.save();
  }

  async findAll(role?: Role): Promise<WorkerDocument[]> {
    const filter = role ? { role } : {};
    return this.workerModel.find(filter).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<WorkerDocument> {
    const worker = await this.workerModel.findById(id);
    if (!worker) throw new NotFoundException('Ishchi topilmadi');
    return worker;
  }

  async findByIdOrNull(id: string): Promise<WorkerDocument | null> {
    return this.workerModel.findById(id);
  }

  async findByEmployeeIdWithPassword(employeeId: string): Promise<WorkerDocument | null> {
    return this.workerModel.findOne({ employeeId }).select('+password');
  }

  async update(id: string, dto: UpdateWorkerDto): Promise<WorkerDocument> {
    const data: Record<string, unknown> = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }
    const worker = await this.workerModel.findByIdAndUpdate(id, data, { new: true });
    if (!worker) throw new NotFoundException('Ishchi topilmadi');
    return worker;
  }

  async remove(id: string): Promise<void> {
    const res = await this.workerModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Ishchi topilmadi');
  }

  async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
