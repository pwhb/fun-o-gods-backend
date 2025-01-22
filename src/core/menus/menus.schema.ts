import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';

export type MenuDocument = HydratedDocument<Menu>;
@Schema({ timestamps: true })
export class Menu extends Base {
  @Prop({ required: true, unique: true })
  name: string;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
