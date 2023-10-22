import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Role } from '../enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string; role: Role }) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub.toString() },
    });

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (payload.role !== user.role) {
      throw new UnauthorizedException('Unauthorized');
    }

    if ('hash' in user) {
      delete (user as { hash: string }).hash;
    }

    return user;
  }
}
