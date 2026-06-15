import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { WorkerDocument } from './schemas/worker.schema';
import { WorkersService } from './workers.service';

@Controller('workers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Get()
  @Roles(Role.ADMIN)
  findAll(@Query('role') role?: Role) {
    return this.workersService.findAll(role);
  }

  @Get('me')
  findMe(@CurrentUser() user: WorkerDocument) {
    return this.workersService.findById(user._id.toString());
  }

  @Patch('me')
  updateMe(@CurrentUser() user: WorkerDocument, @Body() dto: UpdateProfileDto) {
    return this.workersService.update(user._id.toString(), dto);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.workersService.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateWorkerDto) {
    return this.workersService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateWorkerDto) {
    return this.workersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.workersService.remove(id);
  }
}
