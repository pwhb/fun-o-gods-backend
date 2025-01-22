import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Matches, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username must be alphanumeric' })
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty()
  @IsOptional()
  rememberMe?: boolean;
}
