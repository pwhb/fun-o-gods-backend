import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';
import { Role } from 'src/core/roles/roles.schema';

export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User extends Base {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, default: 'web' })
  client: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Role.name,
    required: true,
  })
  roleId: string;

  @Prop({})
  email?: string;

  @Prop({ default: false })
  isEmailVerified?: boolean;

  @Prop({ required: false })
  deviceId?: string;

  @Prop({ required: true, default: 'init' })
  status?: string;

  @Prop({ required: true, default: 'user' })
  type?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('role', {
  ref: Role.name,
  localField: 'roleId',
  foreignField: '_id',
  justOne: true,
});
