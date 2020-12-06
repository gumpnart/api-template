import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  readonly password: string;
}
