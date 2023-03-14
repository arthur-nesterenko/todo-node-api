/* eslint-disable sort-keys */
import { objectType, arg, nonNull, nullable } from 'nexus';
import type { Context } from './context';
import * as jwtService from '../services/jwt';
import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import { Todo } from '@prisma/client';

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.nonNull.field('signupUser', {
      type: 'AuthPayload',
      args: {
        data: nonNull(
          arg({
            type: 'signupInput',
          }),
        ),
      },
      resolve: async (_, args, context: Context) => {
        const isUserExist = await context.db.user.findUnique({
          where: {
            email: args.data.email,
          },
        });

        if (isUserExist) {
          throw new GraphQLError('User already exists');
        }

        const user = await context.db.user.create({
          data: args.data,
        });
        const token = jwtService.generateToken(user.id);
        return {
          token,
        };
      },
    });
    t.nonNull.field('loginUser', {
      type: 'AuthPayload',
      args: {
        data: nonNull(
          arg({
            type: 'loginInput',
          }),
        ),
      },
      resolve: async (_, args, context: Context) => {
        const user = await context.db.user.findUnique({
          where: {
            email: args.data.email,
          },
        });
        if (!user) {
          throw new GraphQLError('Email or password is incorrect', {
            extensions: {
              code: 'BAD_REQUEST',
            },
          });
        }

        const isValid = await bcrypt.compare(args.data.password, user.password);

        if (!isValid) {
          throw new GraphQLError('Email or password is incorrect', {
            extensions: {
              code: 'BAD_REQUEST',
            },
          });
        }

        const token = jwtService.generateToken(user.id);
        return {
          token,
        };
      },
    });
    t.nonNull.field('createTodo', {
      type: 'Todo',
      args: {
        data: nonNull(
          arg({
            type: 'todoInput',
          }),
        ),
      },
      authorize: (root, args, ctx) => ctx.auth.isAuthenticated(ctx.userId),
      resolve: (_, args, context: Context) => {
        try {
          return context.db.todo.create({
            data: {
              title: args.data.title,
              userId: context.userId as string,
            },
          });
        } catch (error) {
          throw new GraphQLError('Todo not created');
        }
      },
    });
    t.nonNull.field('deleteTodo', {
      type: nullable('Todo'),
      args: {
        data: nonNull(
          arg({
            type: 'todoDeleteInput',
          }),
        ),
      },
      authorize: (root, args, ctx) => ctx.auth.isAuthenticated(ctx.userId),
      resolve: async (_, args, context: Context) => {
        const todo = await context.db.todo.delete({
          where: {
            id: args.data.id,
          },
        });

        if (!todo) {
          throw new GraphQLError('Todo not found');
        }

        return todo;
      },
    });
    t.nonNull.field('updateTodo', {
      type: 'Todo',
      args: {
        data: nonNull(
          arg({
            type: 'todoUpdateInput',
          }),
        ),
      },
      authorize: (root, args, ctx) => ctx.auth.isAuthenticated(ctx.userId),
      resolve: (_, args, context: Context) => {
        const { id, ...todo } = args.data;
        return context.db.todo.update({
          where: {
            id,
          },
          data: {
            ...(todo as Todo),
          },
        });
      },
    });
  },
});

export default Mutation;
