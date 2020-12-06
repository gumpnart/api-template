import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import { PrismaService } from '../shared/services/prisma.service';
import { LoginUserDto } from '../user/dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(payload: LoginUserDto): Promise<any> {
    const _user = await this.prisma.user.findOne({
      where: { email: payload.email },
    });

    const errors = { User: 'email or password wrong' };

    if (!_user) {
      throw new HttpException({ errors }, 401);
    }

    const authenticated = await argon2.verify(_user.password, payload.password);

    if (!authenticated) {
      throw new HttpException({ errors }, 401);
    }

    const { password, ...user } = _user;
    return {
      access_token: this.jwtService.sign(user),
    };
  }
}
