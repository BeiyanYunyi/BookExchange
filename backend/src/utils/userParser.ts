/* eslint-disable no-underscore-dangle */

const userParser = (
  user: {
    id: number;
    name: string;
    password: string;
    avatar: string | null;
    role: number;
    stuNum: string;
    college: string | null;
    class: string | null;
    lastRevokeTime: number;
  } | null,
) => {
  if (!user) return user;
  if (typeof user === 'object') {
    return { id: user.id, avatar: user.avatar };
  }
  return user;
};

export default userParser;
