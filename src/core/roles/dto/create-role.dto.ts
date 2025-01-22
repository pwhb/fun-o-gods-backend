import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsArray()
  menuIds: string[];

  @ApiProperty()
  @IsArray()
  permissionIds: string[];
}
