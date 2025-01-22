import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';
import { User } from 'src/users/users.schema';

export type TokenDocument = HydratedDocument<Token>;
@Schema({ timestamps: true })
export class Token extends Base {
  @Prop()
  deviceId: string;

  @Prop()
  token: string;

  @Prop({ default: 'web' })
  client: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ type: Date })
  expiredAt: Date;

  @Prop()
  rememberMe: boolean;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
