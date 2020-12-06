import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {

  @IsNotEmpty()
  @ApiProperty({
    type: String
  })
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String
  })
  readonly password: string;
}