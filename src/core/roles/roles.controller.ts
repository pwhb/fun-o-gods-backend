import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryRoleDto } from './dto/query-role.dto';
import STRINGS from 'src/common/consts/strings.json';
import { parseQuery, QueryType } from 'src/common/db/query';
import { Response } from 'express';
import { JwtAuthGuard, RoleGuard } from 'src/auth/auth.guard';

@ApiBearerAuth()
@ApiTags('roles')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('api/v1/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto, @Res() res: Response) {
    const data = await this.rolesService.create(createRoleDto);
    return res.status(200).json({
      ok: true,
      data,
    });
  }

  @Get()
  async findMany(@Query() query: QueryRoleDto, @Res() res: Response) {
    const { skip, limit, page, sort, filter } = parseQuery(query, [
      {
        key: 'q',
        type: QueryType.Regex,
        searchedFields: [''],
      },
    ]);

    const { count, data } = await this.rolesService.findMany({
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
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const data = await this.rolesService.findOne(id);
    if (!data)
      return res.status(404).json({ message: STRINGS.RESPONSES.NOT_FOUND });
    return res.status(200).json({
      ok: true,
      data,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res() res: Response,
  ) {
    const data = await this.rolesService.update(id, updateRoleDto);
    if (!data)
      return res.status(404).json({ message: STRINGS.RESPONSES.NOT_FOUND });
    return res.status(200).json({
      ok: true,
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const data = await this.rolesService.remove(id);
    if (!data)
      return res.status(404).json({ message: STRINGS.RESPONSES.NOT_FOUND });
    return res.status(200).json({
      ok: true,
      data,
    });
  }
}
