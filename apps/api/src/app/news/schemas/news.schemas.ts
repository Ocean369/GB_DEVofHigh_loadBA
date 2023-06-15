import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NewsDocument = HydratedDocument<News>;

@Schema()
export class News {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  author: string;

  @Prop({default: null})
  cover: string;

  @Prop({required: true,default: new Date()})
  createdAt: Date;

  @Prop({required: true,default: new Date()})
  updatedAt: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);
