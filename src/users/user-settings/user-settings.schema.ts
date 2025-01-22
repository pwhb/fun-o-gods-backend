import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';
import { User } from '../users.schema';

export type UserSettingDocument = HydratedDocument<UserSetting>;
@Schema({ timestamps: true })
export class UserSetting extends Base {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: string;

  @Prop({})
  bio?: string;

  @Prop({})
  avatar?: string;

  @Prop({ type: String, default: 'en' })
  language?: string;

  @Prop({ type: [String], default: [] })
  philosophies?: string[];
}

export const UserSettingSchema = SchemaFactory.createForClass(UserSetting);
