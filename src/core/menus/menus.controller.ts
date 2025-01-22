import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import STRINGS from 'src/common/consts/strings.json';
import { parseQuery, QueryType } from 'src/common/db/query';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RoleGuard } from 'src/auth/auth.guard';
@ApiBearerAuth()
@ApiTags('menus')
@Controller('api/v1/menus')
@UseGuards(JwtAuthGuard, RoleGuard)
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  async create(@Body() dto: CreateMenuDto, @Res() res: Response) {
    const data = await this.menusService.create(dto);
    return res.status(200).json({
      ok: true,
      data,
    });
  }

  @Get()
  async findMany(@Query() query: any, @Res() res: Response) {
    const { skip, limit, page, sort, filter } = parseQuery(query, [
      {
        key: 'q',
        type: QueryType.Regex,
        searchedFields: ['name'],
      },
    ]);

    const { count, data } = await this.menusService.findMany({
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
    const data = await this.menusService.findOne(id);
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
    @Body() dto: UpdateMenuDto,
    @Res() res: Response,
  ) {
    const data = await this.menusService.update(id, dto);
    if (!data)
      return res.status(404).json({ message: STRINGS.RESPONSES.NOT_FOUND });
    return res.status(200).json({
      ok: true,
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const data = await this.menusService.remove(id);
    if (!data)
      return res.status(404).json({ message: STRINGS.RESPONSES.NOT_FOUND });
    return res.status(200).json({
      ok: true,
      data,
    });
  }
}
