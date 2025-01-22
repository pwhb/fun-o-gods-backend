import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';
import { User } from 'src/users/users.schema';

export type AuthDocument = HydratedDocument<Auth>;
@Schema({ timestamps: true })
export class Auth extends Base {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: 'web' })
  client: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
