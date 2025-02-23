import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class QueryUserDto extends PartialType(
  PickType(CreateUserDto, [] as const),
) {
  @ApiProperty()
  @IsOptional()
  q?: string;

  @ApiProperty()
  @IsOptional()
  page?: number;

  @ApiProperty()
  @IsOptional()
  size?: number;

  @ApiProperty()
  @IsOptional()
  sort_by?: string;
}
