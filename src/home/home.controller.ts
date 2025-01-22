import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RoleGuard } from 'src/auth/auth.guard';
import STRINGS from 'src/common/consts/strings.json';

@ApiBearerAuth()
@ApiTags('home')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('api/v1/home')
export class HomeController
{
  constructor() { }

}
