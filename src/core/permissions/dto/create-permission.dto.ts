import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  path: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  method: string;

  @ApiProperty()
  @IsOptional()
  slug?: string;

  @ApiProperty()
  @IsOptional()
  allowedRoles?: string[];
}
