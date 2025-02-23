import { Injectable } from '@nestjs/common';
import { UserSetting, UserSettingDocument } from './user-settings.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectModel(UserSetting.name)
    private readonly userSettingModel: Model<UserSetting>,
  ) {}
  create(dto: UserSetting) {
    return this.userSettingModel.create(dto);
  }
}
