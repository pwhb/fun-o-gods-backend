import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.schema';
import { CacheService } from 'src/core/cache/cache.service';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import STRINGS from 'src/common/consts/strings.json';
import { permission } from 'process';
import { Auth } from 'src/auth/auth.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Auth.name) private readonly authModel: Model<Auth>,
    private readonly cacheService: CacheService,
  ) {}
  async create(dto: User) {
    const alreadyExists = await this.userModel.countDocuments({
      username: dto.username,
      client: dto.client,
    });
    if (alreadyExists) throw Error(STRINGS.RESPONSES.USER_ALREADY_EXISTS);
    const data = await this.userModel.create(dto);
    return data;
  }

  async findMany({
    filter,
    skip,
    limit,
    sort,
  }: {
    filter: FilterQuery<User>;
    skip?: number;
    limit?: number;
    sort?: QueryOptions<User>;
  }) {
    const docs = await this.userModel
      .find(filter, {}, { skip, limit, sort })
      .populate('role', {
        _id: 0,
        name: 1,
      })
      .lean();
    const count = await this.userModel.countDocuments(filter);
    return {
      count,
      data: docs,
    };
  }

  findOneById(id: string) {
    return this.userModel
      .findById(id)
      .populate('role', {
        _id: 0,
        name: 1,
      })
      .select({
        deviceId: 0,
        updatedAt: 0,
      })
      .lean();
  }

  findOneByIdForAuth(id: string) {
    return this.cacheService.get(`USERS:${id}`, () =>
      this.userModel
        .findById(id)
        .populate('role', {
          _id: 0,
          name: 1,
          permissionIds: 1,
        })
        .select({
          deviceId: 0,
          updatedAt: 0,
        })
        .lean(),
    );
  }

  findOneByFilter(filter: FilterQuery<User>) {
    return this.userModel.findOne(filter).lean();
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.cacheService.del(`USERS:${id}`);
    return this.userModel
      .findByIdAndUpdate(id, dto, { returnDocument: 'after' })
      .lean();
  }

  async remove(id: string) {
    await this.cacheService.del(`USERS:${id}`);
    const deleted = await this.userModel.findByIdAndDelete(id).lean();
    await this.authModel.findOneAndDelete({ userId: deleted?._id }).lean();
    if (!deleted) throw Error(STRINGS.RESPONSES.USER_NOT_FOUND);
    return deleted;
  }
}
