import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserRO } from './user.interface';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../shared/services/prisma.service';

const select = {
  email: true,
  username: true,
  bio: true,
  image: true,
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<any[]> {
    return await this.prisma.user.findMany({ select });
  }

  async create(dto: CreateUserDto): Promise<UserRO> {
    const { username, email, password } = dto;

    // check uniqueness of username/email
    const userExist = await this.prisma.user.findOne({
      where: { email },
    });

    if (userExist) {
      const errors = { username: 'Username and email must be unique.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST
      );
    }

    const hashedPassword = await argon2.hash(password);

    const data = {
      username,
      email,
      password: hashedPassword,
    };
    const user = await this.prisma.user.create({ data, select });

    return { user };
  }

  async update(id: number, data: UpdateUserDto): Promise<any> {
    const where = { id };
    const user = await this.prisma.user.update({ where, data, select });

    return { user };
  }

  async delete(email: string): Promise<any> {
    return await this.prisma.user.delete({ where: { email }, select });
  }

  async findById(id: number): Promise<any> {
    const user = await this.prisma.user.findOne({
      where: { id },
      select: { id: true, ...select },
    });
    return { user };
  }

  async findByEmail(email: string): Promise<any> {
    const user = await this.prisma.user.findOne({ where: { email }, select });
    return { user };
  }
}
