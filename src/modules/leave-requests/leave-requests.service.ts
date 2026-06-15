import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { LeaveRequest, LeaveRequestDocument, LeaveRequestStatus } from './schemas/leave-request.schema';

@Injectable()
export class LeaveRequestsService {
  constructor(
    @InjectModel(LeaveRequest.name)
    private readonly leaveRequestModel: Model<LeaveRequestDocument>,
  ) {}

  async create(workerId: string, dto: CreateLeaveRequestDto): Promise<LeaveRequestDocument> {
    return this.leaveRequestModel.create({
      workerId: new Types.ObjectId(workerId),
      type: dto.type,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      reason: dto.reason,
    });
  }

  async findByWorker(workerId: string): Promise<LeaveRequestDocument[]> {
    return this.leaveRequestModel
      .find({ workerId: new Types.ObjectId(workerId) })
      .sort({ createdAt: -1 });
  }

  async findAll(status?: LeaveRequestStatus): Promise<LeaveRequestDocument[]> {
    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    return this.leaveRequestModel
      .find(query)
      .sort({ createdAt: -1 })
      .populate('worker', 'name employeeId position');
  }

  async updateStatus(
    id: string,
    status: LeaveRequestStatus,
    response?: string,
  ): Promise<LeaveRequestDocument> {
    const request = await this.leaveRequestModel.findById(id);
    if (!request) {
      throw new NotFoundException('Leave request not found');
    }
    request.status = status;
    if (response !== undefined) request.response = response;
    return request.save();
  }
}
