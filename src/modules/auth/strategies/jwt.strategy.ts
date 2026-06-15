import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { WorkersService } from '../../workers/workers.service';

interface JwtPayload {
  sub: string;
  employeeId: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly workersService: WorkersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    const worker = await this.workersService.findByIdOrNull(payload.sub);
    if (!worker) throw new UnauthorizedException('Avtorizatsiya talab qilinadi');
    return worker;
  }
}
