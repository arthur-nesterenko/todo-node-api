import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { schema, createContext } from './graphql';
import type { Context } from './graphql/context';

const PORT = Number(process.env.PORT) || 3000;
const start = async () => {
  const server = new ApolloServer<Context>({
    schema,
  });

  const { url } = await startStandaloneServer(server, {
    context: createContext,
    listen: { port: PORT },
  });

  return url;
};

// eslint-disable-next-line no-console
start().then(url => console.log(`🚀  Server ready at ${url}`));
