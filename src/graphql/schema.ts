import { makeSchema, fieldAuthorizePlugin } from 'nexus';
import Query from './query';
import Mutation from './mutation';
import { join } from 'path';
import {
  User,
  Todo,
  AuthPayload,
  signupInput,
  loginInput,
  todoInput,
  todoDeleteInput,
  todoUpdateInput,
} from './type-defs';

export const schema = makeSchema({
  contextType: {
    export: 'Context',
    module: join(process.cwd(), 'src', 'graphql', 'context.ts'),
  },
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  plugins: [fieldAuthorizePlugin()],
  sourceTypes: {
    modules: [
      {
        alias: 'db',
        module: '@prisma/client',
      },
    ],
  },
  types: [
    Query,
    Mutation,
    User,
    Todo,
    AuthPayload,
    signupInput,
    loginInput,
    todoInput,
    todoDeleteInput,
    todoUpdateInput,
  ],
});

export default schema;
