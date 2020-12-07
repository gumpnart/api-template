import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Controller,
  UsePipes,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRO } from './user.interface';
import { CreateUserDto, UpdateUserDto } from './dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';

import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('users')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async findMe(@Request() req): Promise<UserRO> {
    return await this.userService.findByEmail(req.user.email);
  }

  @Put('user')
  @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Body('user') userData: UpdateUserDto) {
    return await this.userService.update(req.user.userId, userData);
  }

  @UsePipes(new ValidationPipe())
  @Post('users')
  @ApiBody({
    type: CreateUserDto,
  })
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Delete('user/:slug')
  @UseGuards(JwtAuthGuard)
  async delete(@Param() params) {
    console.log(params);
    return await this.userService.delete(params.slug);
  }
}
