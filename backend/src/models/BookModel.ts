/* eslint-disable no-underscore-dangle */
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { User } from './UserModel';

export enum BookStatusEnum {
  pending = 0,
  avaliable = 1,
  ordered = 2,
  borrowed = 3,
  lost = 4,
}

class Book {
  @prop({ required: true })
  title!: string;

  @prop({ required: true })
  desc!: string;

  @prop({ required: true })
  author!: string;

  @prop({
    required: true,
    ref: () => User,
  })
  owner!: Ref<User>;

  @prop({
    ref: () => User,
  })
  orderBy!: Ref<User>;

  @prop({ required: true, type: String, default: [] })
  tags!: mongoose.Types.Array<string>;

  @prop({ default: '' })
  img!: string;

  @prop({ enum: BookStatusEnum, required: true })
  status!: number;
}

const BookModel = getModelForClass(Book);

export default BookModel;
