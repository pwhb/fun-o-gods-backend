import { Injectable, Logger } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './permissions.schema';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
    private readonly cacheService: CacheService,
  ) {}

  async create(dto: CreatePermissionDto) {
    dto.slug = dto.path.split('/')[3];
    if (!dto.name) {
      let action = '';
      if (dto.method === 'GET') action = 'read';
      if (dto.method === 'POST') action = 'create';
      if (dto.method === 'PATCH' || dto.method === 'PUT') action = 'update';
      if (dto.method === 'DELETE') action = 'delete';
      dto.name = `${action} ${dto.slug}`.toUpperCase();
    }
    return this.permissionModel.create(dto);
  }

  async getPermissionId(query: { path: string; method: string }) {
    const found = await this.permissionModel.findOne(query).lean();
    if (found) return found._id;
    const created = await this.create(query);
    return created._id;
  }

  async checkPermission(query: { path: string; method: string }, role: any) {
    let allowedRoles = ['ROOT'];
    if (allowedRoles.includes(role.name)) return true;

    const found = await this.cacheService.get(
      `PERMISSIONS:${query.method}:${query.path}`,
      () => this.permissionModel.findOne(query).lean(),
    );

    if (found) {
      allowedRoles = found.allowedRoles;
      if (
        allowedRoles.includes(role.name) ||
        allowedRoles.includes('PUBLIC') ||
        role.permissionIds.some(
          (permissionId: any) =>
            permissionId.toString() === found._id.toString(),
        )
      ) {
        return true;
      }

      this.logger.debug(`permissionId: ${found._id}, roleId: ${role.name}`);
      return false;
    }
    const perm = await this.create(query);
    this.logger.debug(`permissionId: ${perm._id}, roleId: ${role.name}`);
    return false;
  }

  async findMany({
    filter,
    skip,
    limit,
    sort,
  }: {
    filter: FilterQuery<Permission>;
    skip?: number;
    limit?: number;
    sort?: QueryOptions<Permission>;
  }) {
    const docs = await this.permissionModel
      .find(filter, {}, { skip, limit, sort })
      .lean();
    const count = await this.permissionModel.countDocuments(filter);
    return {
      count,
      data: docs,
    };
  }

  findOne(id: string) {
    return this.permissionModel.findById(id).lean();
  }

  async update(id: string, dto: UpdatePermissionDto) {
    await this.cacheService.del(`PERMISSIONS:${dto.method}:${dto.path}`);
    return this.permissionModel
      .findByIdAndUpdate(id, dto, { returnDocument: 'after' })
      .lean();
  }

  remove(id: string) {
    return this.permissionModel.findByIdAndDelete(id).lean();
  }
}
