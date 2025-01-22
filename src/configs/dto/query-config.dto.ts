import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateConfigDto } from './create-config.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryConfigDto extends PartialType(
  PickType(CreateConfigDto, ['name', 'code'] as const),
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
