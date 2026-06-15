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
import { WorkerDocument } from '../workers/schemas/worker.schema';
import { GenerateSalaryDto } from './dto/generate-salary.dto';
import { ListSalaryQueryDto } from './dto/list-salary-query.dto';
import { UpdateSalaryStatusDto } from './dto/update-salary-status.dto';
import { SalaryService } from './salary.service';

@Controller('salary')
@UseGuards(JwtAuthGuard)
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Post('generate')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  generate(@Body() dto: GenerateSalaryDto) {
    return this.salaryService.generate(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll(@Query() query: ListSalaryQueryDto) {
    return this.salaryService.findAll(query);
  }

  @Get('me')
  findMine(@CurrentUser() user: WorkerDocument) {
    return this.salaryService.findByWorker(user._id.toString());
  }

  @Get('worker/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findByWorker(@Param('id') id: string) {
    return this.salaryService.findByWorker(id);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.salaryService.findById(id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateSalaryStatusDto) {
    return this.salaryService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.salaryService.remove(id);
  }
}
