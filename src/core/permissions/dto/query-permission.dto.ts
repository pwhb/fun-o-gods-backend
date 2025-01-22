import { PartialType, PickType } from '@nestjs/mapped-types';

import { IsOptional } from 'class-validator';
import { CreatePermissionDto } from './create-permission.dto';
import { ApiProperty } from '@nestjs/swagger';

export class QueryPermissionDto extends PartialType(
  PickType(CreatePermissionDto, ['name', 'method', 'path'] as const),
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
