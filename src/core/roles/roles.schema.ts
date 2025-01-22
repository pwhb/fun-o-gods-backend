import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';
import { Menu } from 'src/core/menus/menus.schema';
import { Permission } from 'src/core/permissions/permissions.schema';

export type RoleDocument = HydratedDocument<Role>;
@Schema({ timestamps: true })
export class Role extends Base {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Menu.name }] })
  menuIds: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Permission.name }],
  })
  permissionIds: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
