import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryRoleDto extends PartialType(
  PickType(CreateRoleDto, [] as const),
) {
  @ApiProperty({ required: false })
  @IsOptional()
  q?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  size?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  sort_by?: string;
}
