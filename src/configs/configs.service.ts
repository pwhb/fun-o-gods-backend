import { Injectable } from '@nestjs/common';

import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Config, ConfigDocument, VisibilityType } from './configs.schema';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { CacheService } from 'src/core/cache/cache.service';

@Injectable()
export class ConfigsService {
  constructor(
    @InjectModel(Config.name) private readonly configModel: Model<Config>,
    private readonly cacheService: CacheService,
  ) {}
  async get(code: string, visibility = VisibilityType.PUBLIC): Promise<any> {
    const filter: FilterQuery<Config> = { code };
    if (visibility !== VisibilityType.ANY) {
      filter['visibility'] = visibility;
    }
    const config = await this.cacheService.get(
      `${visibility}:configs:${code}`,
      () => this.configModel.findOne(filter).lean(),
    );

    if (!config) return null;

    return this.structureConfig(config);
  }

  structureConfig(config: ConfigDocument) {
    const subConfigs: any = {};
    if (config.subConfigs.length) {
      for (const subConfig of config.subConfigs) {
        subConfigs[subConfig.code] = subConfig.value;
      }
    }
    return {
      code: config.code,
      name: config.name,
      type: config.type,
      value: config.value,
      subConfigs,
    };
  }

  async resetCache(): Promise<any> {
    return this.cacheService.reset();
  }

  async create(dto: CreateConfigDto) {
    const data = await this.configModel.create(dto);
    return data;
  }

  async findMany({
    filter,
    skip,
    limit,
    sort,
  }: {
    filter: FilterQuery<Config>;
    skip?: number;
    limit?: number;
    sort?: QueryOptions<Config>;
  }) {
    const docs = await this.configModel
      .find(filter, {}, { skip, limit, sort })
      .lean();
    const count = await this.configModel.countDocuments(filter);
    return {
      count,
      data: docs,
    };
  }

  async findOne(id: string) {
    const data = await this.configModel.findById(id).lean();
    return data;
  }

  async update(id: string, updateConfigDto: UpdateConfigDto) {
    const data = await this.configModel
      .findByIdAndUpdate(id, updateConfigDto, { returnDocument: 'after' })
      .lean();
    if (!data) return null;
    await this.cacheService.del(`PRIVATE:configs:${data.code}`);
    await this.cacheService.del(`PUBLIC:configs:${data.code}`);
    await this.cacheService.del(`ANY:configs:${data.code}`);
    return data;
  }

  async remove(id: string) {
    const data = await this.configModel.findByIdAndDelete(id).lean();
    if (!data) return null;
    await this.cacheService.del(`PRIVATE:configs:${data.code}`);
    await this.cacheService.del(`PUBLIC:configs:${data.code}`);
    await this.cacheService.del(`ANY:configs:${data.code}`);
    return data;
  }
}
