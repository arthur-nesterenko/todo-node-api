/* eslint-disable sort-keys */
import { objectType, inputObjectType } from 'nexus';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('username');
    t.nonNull.string('email');
  },
});

export const Todo = objectType({
  name: 'Todo',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('title');
    t.nonNull.boolean('completed');
    t.nonNull.string('userId');
  },
});

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.nonNull.string('token');
  },
});

// INPUT TYPES

export const signupInput = inputObjectType({
  name: 'signupInput',
  definition(t) {
    t.nonNull.string('username'),
      t.nonNull.string('email'),
      t.nonNull.string('password');
  },
});

export const loginInput = inputObjectType({
  name: 'loginInput',
  definition(t) {
    t.nonNull.string('email'), t.nonNull.string('password');
  },
});

export const todoInput = inputObjectType({
  name: 'todoInput',
  definition(t) {
    t.nonNull.string('title');
  },
});

export const todoUpdateInput = inputObjectType({
  name: 'todoUpdateInput',
  definition(t) {
    t.nonNull.string('id');
    t.string('title');
    t.boolean('completed');
  },
});

export const todoDeleteInput = inputObjectType({
  name: 'todoDeleteInput',
  definition(t) {
    t.nonNull.string('id');
  },
});
