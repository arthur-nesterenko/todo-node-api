/* eslint-disable sort-keys */
import { objectType, stringArg, booleanArg, nullable, nonNull } from 'nexus';
import type { Context } from './context';

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('me', {
      type: 'User',
      authorize: (root, args, ctx) => ctx.auth.isAuthenticated(ctx.userId),
      resolve: (_parent, _args, context: Context) => {
        return context.db.user.findUnique({
          where: {
            id: context.userId as string,
          },
        });
      },
    });
    t.nonNull.list.field('todos', {
      type: 'Todo',
      args: {
        completed: nullable(booleanArg()),
      },
      authorize: (root, _args, ctx) => ctx.auth.isAuthenticated(ctx.userId),
      resolve: (_parent, args, context: Context) => {
        const and =
          args.completed === null ? {} : { completed: args.completed };
        return context.db.todo.findMany({
          where: {
            userId: context.userId as string,
            ...and,
          },
        });
      },
    });
    t.nullable.field('todoById', {
      type: 'Todo',
      args: {
        id: nonNull(stringArg()),
      },
      authorize: (root, args, ctx) => ctx.auth.isAuthenticated(ctx.userId),
      resolve: (_parent, args, context: Context) => {
        return context.db.todo.findUnique({
          where: {
            id: args.id || undefined,
          },
        });
      },
    });
  },
});

export default Query;
