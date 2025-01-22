import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { TConfig } from '../configs.schema';

export class CreateConfigDto {
  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  value: any;

  @ApiProperty({ required: false })
  @IsOptional()
  visibility: string;

  @ApiProperty({ default: [] })
  @IsArray()
  subConfigs: TConfig[];
}
