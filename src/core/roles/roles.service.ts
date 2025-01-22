import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './roles.schema';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private readonly cacheService: CacheService,
  ) {}
  async create(dto: CreateRoleDto) {
    return this.roleModel.create(dto);
  }

  async findMany({
    filter,
    skip,
    limit,
    sort,
  }: {
    filter: FilterQuery<Role>;
    skip?: number;
    limit?: number;
    sort?: QueryOptions<Role>;
  }) {
    const docs = await this.roleModel
      .find(filter, {}, { skip, limit, sort })
      .lean();
    const count = await this.roleModel.countDocuments(filter);
    return {
      count,
      data: docs,
    };
  }

  findOne(id: string) {
    return this.roleModel.findById(id).lean();
  }

  async update(id: string, dto: UpdateRoleDto) {
    const updated = await this.roleModel
      .findByIdAndUpdate(id, dto, { returnDocument: 'after' })
      .lean();
    await this.cacheService.reset();
    return updated;
  }

  remove(id: string) {
    return this.roleModel.findByIdAndDelete(id).lean();
  }
}
