import { getModelForClass, prop } from '@typegoose/typegoose';
import mongoose from 'mongoose';

enum BookStatusEnum {
  pending = 0,
  avaliable = 1,
  borrowed = 2,
  returned = 3,
  lost = 4,
}

class Book {
  @prop({ required: true })
  title!: string;

  @prop({ required: true })
  desc!: string;

  @prop({ required: true })
  author!: string;

  @prop({ required: true, type: String, default: [] })
  tags!: mongoose.Types.Array<string>;

  @prop({ default: null })
  img!: string | null;

  @prop({ enum: BookStatusEnum, required: true })
  status!: number;
}

const BookModel = getModelForClass(Book);

export default BookModel;
