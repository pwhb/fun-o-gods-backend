import { Global, Module } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { ConfigsController } from './configs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Config, ConfigSchema } from './configs.schema';
import { CacheService } from 'src/core/cache/cache.service';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
  ],
  controllers: [ConfigsController],
  providers: [ConfigsService, CacheService],
  exports: [ConfigsService],
})
export class ConfigsModule {}
