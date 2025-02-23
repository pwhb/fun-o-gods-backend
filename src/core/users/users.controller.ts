import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard, RoleGuard } from 'src/auth/auth.guard';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { parseQuery, QueryType } from 'src/common/db/query';
import { QueryUserDto } from './dto/query-user.dto';
@ApiBearerAuth()
@ApiTags('users')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard, RoleGuard)
  me(@Req() req: Request) {
    const me: any = { ...req['user'] };
    delete me.role;
    delete me.roleId;
    return {
      ok: true,
      data: me,
    };
  }

  @Get()
  async findMany(@Query() query: QueryUserDto, @Res() res: Response) {
    const { skip, limit, page, sort, filter } = parseQuery(query, [
      {
        key: 'q',
        type: QueryType.Regex,
        searchedFields: ['method', 'path', 'name'],
      },
    ]);

    const { count, data } = await this.usersService.findMany({
      filter,
      skip,
      limit,
      sort,
    });
    return res.status(200).json({
      ok: true,
      page,
      size: limit,
      count,
      data,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
