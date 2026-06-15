import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../../common/enums/role.enum';
import { WorkerDocument } from '../workers/schemas/worker.schema';
import { WorkersService } from '../workers/workers.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly workersService: WorkersService,
    private readonly jwtService: JwtService,
  ) {}

  private sign(worker: WorkerDocument): string {
    return this.jwtService.sign({
      sub: worker._id.toString(),
      employeeId: worker.employeeId,
      role: worker.role,
    });
  }

  async register(dto: RegisterDto) {
    const worker = await this.workersService.create({ ...dto, role: Role.WORKER });
    return { user: worker.toJSON(), token: this.sign(worker) };
  }

  async login(dto: LoginDto) {
    const worker = await this.workersService.findByEmployeeIdWithPassword(dto.employeeId);
    if (!worker) throw new UnauthorizedException("ID yoki parol noto'g'ri");

    const valid = await this.workersService.comparePassword(dto.password, worker.password);
    if (!valid) throw new UnauthorizedException("ID yoki parol noto'g'ri");

    return { user: worker.toJSON(), token: this.sign(worker) };
  }

  async me(userId: string) {
    const worker = await this.workersService.findById(userId);
    return worker.toJSON();
  }
}
