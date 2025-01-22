import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';

export type PermissionDocument = HydratedDocument<Permission>;
@Schema({ timestamps: true })
export class Permission extends Base {
  @Prop()
  name: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ default: ['ROOT'], type: [String] })
  allowedRoles: string[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

PermissionSchema.index({ path: 1, method: 1 }, { unique: true });
