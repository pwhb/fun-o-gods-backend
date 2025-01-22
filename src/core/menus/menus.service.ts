import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './menus.schema';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MenusService {
  constructor(
    @InjectModel(Menu.name)
    private readonly menuModel: Model<Menu>,
  ) {}
  async create(dto: CreateMenuDto) {
    return this.menuModel.create(dto);
  }

  async findMany({
    filter,
    skip,
    limit,
    sort,
  }: {
    filter: FilterQuery<Menu>;
    skip?: number;
    limit?: number;
    sort?: QueryOptions<Menu>;
  }) {
    const docs = await this.menuModel
      .find(filter, {}, { skip, limit, sort })
      .lean();
    const count = await this.menuModel.countDocuments(filter);
    return {
      count,
      data: docs,
    };
  }

  findOne(id: string) {
    return this.menuModel.findById(id).lean();
  }

  update(id: string, dto: UpdateMenuDto) {
    return this.menuModel
      .findByIdAndUpdate(id, dto, { returnDocument: 'after' })
      .lean();
  }

  remove(id: string) {
    return this.menuModel.findByIdAndDelete(id).lean();
  }
}
