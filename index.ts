import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { typeDefs } from './schema/schemas';
import { resolvers } from './resolvers/resolvers';
// (Add necessary imports for schema, server plugins, and ws)

const app = express();
const httpServer = createServer(app);

// 1. Create executable schema and WS server
const schema = makeExecutableSchema({ typeDefs, resolvers });
const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' });

// 2. Set up Subscription server for WebSocket
useServer({ schema }, wsServer);

// 3. Initialize Apollo Server with plugin to drain HTTP server
const server = new ApolloServer({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
});

await server.start();
server.applyMiddleware({ app });
httpServer.listen(4000, () => {
    console.log(`Server is now running on http://localhost:4000${server.graphqlPath}`);
    console.log(`Subscriptions ready at ws://localhost:4000${server.graphqlPath}`);
});
