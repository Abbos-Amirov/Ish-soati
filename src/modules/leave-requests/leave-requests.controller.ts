import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { WorkerDocument } from '../workers/schemas/worker.schema';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestStatusDto } from './dto/update-leave-request-status.dto';
import { LeaveRequestsService } from './leave-requests.service';
import { LeaveRequestStatus } from './schemas/leave-request.schema';

@Controller('leave-requests')
@UseGuards(JwtAuthGuard)
export class LeaveRequestsController {
  constructor(private readonly leaveRequestsService: LeaveRequestsService) {}

  @Post()
  create(@CurrentUser() user: WorkerDocument, @Body() dto: CreateLeaveRequestDto) {
    return this.leaveRequestsService.create(user._id.toString(), dto);
  }

  @Get('me')
  getMine(@CurrentUser() user: WorkerDocument) {
    return this.leaveRequestsService.findByWorker(user._id.toString());
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll(@Query('status') status?: LeaveRequestStatus) {
    return this.leaveRequestsService.findAll(status);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLeaveRequestStatusDto,
  ) {
    return this.leaveRequestsService.updateStatus(id, dto.status, dto.response);
  }
}
