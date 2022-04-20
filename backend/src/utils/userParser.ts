/* eslint-disable no-underscore-dangle */
import { Ref } from '@typegoose/typegoose';
import { User } from '../models/UserModel';

const userParser = (user: Ref<User, string | undefined>) => {
  if (typeof user === 'object') {
    return { id: user._id, name: user.name, avatar: user.avatar };
  }
  return user;
};

export default userParser;
