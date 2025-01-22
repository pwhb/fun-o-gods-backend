import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Base {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy?: string;
}

export type LanguageString = {
  my: string;
  en: string;
};
