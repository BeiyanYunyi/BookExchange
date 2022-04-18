import { getModelForClass, prop } from '@typegoose/typegoose';

export enum UserRoleEnum {
  default = 0,
  admin = 1,
}

export class User {
  declare _id: string;

  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  password!: string;

  @prop({ default: null })
  avatar!: string | null;

  @prop({ enum: UserRoleEnum, required: true })
  role!: number;

  @prop({ unique: true, index: true })
  stuNum!: string;

  @prop()
  collage!: string;

  @prop()
  class!: string;

  @prop()
  lastRevokeTime!: number;
}

const UserModel = getModelForClass(User);

export default UserModel;
