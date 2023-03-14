import db from '../database';

const Auth = {
  isAuthenticated: async (userId: string | null) => {
    if (userId === null) return false;
    const user = await db.user.findUnique({
      where: { id: userId },
    });
    return Boolean(user);
  },
} as const;

export default Auth;
