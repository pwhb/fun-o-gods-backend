import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { CacheService } from 'src/core/cache/cache.service';
import { Auth, AuthSchema } from 'src/auth/auth.schema';
import { UserSettingsService } from './user-settings/user-settings.service';
import {
  UserSetting,
  UserSettingSchema,
} from './user-settings/user-settings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Auth.name, schema: AuthSchema },
      { name: UserSetting.name, schema: UserSettingSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, CacheService, UserSettingsService],
  exports: [UsersService, UserSettingsService],
})
export class UsersModule {}
