import { sign, verify } from 'jsonwebtoken';

const EXPIRES_IN = '7 days';
export const generateToken = (userId: string) => {
  return sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: EXPIRES_IN,
  });
};

export const getUserIdFromToken = (token?: string) => {
  if (token) {
    try {
      const { userId } = verify(
        token.replace('Bearer ', ''),
        process.env.JWT_SECRET as string,
      ) as { userId: string };
      return userId;
    } catch (e) {
      return null;
    }
  }
  return null;
};
