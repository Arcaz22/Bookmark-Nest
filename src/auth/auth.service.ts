import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { signUpDto, signInDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from './entity';
import { Role } from './enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signUp: signUpDto): Promise<{
    name: string;
    username: string;
    phone: string;
    email: string;
    role: string;
  }> {
    const { name, username, phone, email } = signUp;

    try {
      const hash = await argon.hash(signUp.password);

      const newUser = this.userRepository.create({
        name,
        username,
        phone,
        email,
        password: hash,
        role: Role.USER,
      });

      await this.userRepository.save(newUser);

      return { name, username, phone, email, role: Role.USER };
    } catch (error) {
      if (error.code === 'P2002' && error.detail.includes('already exists')) {
        throw new ConflictException(
          'User with the same username, email, or phone already exists',
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(signIn: signInDto): Promise<{ access_token: string }> {
    const { email, password } = signIn;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new ForbiddenException('Credentials incorrect or invalid');
    }

    const passMatch = await argon.verify(user.password, password);

    if (!passMatch) {
      throw new ForbiddenException('Credentials incorrect');
    }

    return this.signToken(user.id, user.email, user.role);
  }

  async signToken(
    userId: string,
    email: string,
    role: Role,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
      role,
    };
    const secret = this.configService.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
