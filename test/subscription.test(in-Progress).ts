import { ApolloServer } from 'apollo-server-express';
import { resolvers } from '../resolvers/resolvers';
import { typeDefs } from '../schema/schemas';
import { PubSub } from 'graphql-subscriptions';

describe('Using Jest to test GraphQL Subscriptions', () => {
    const sharedPubSub = new PubSub();
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => ({ pubsub: sharedPubSub })
    })
    it('Subscribe to notifications and create a new user', async () => {
        await apolloServer.executeOperation({
            query: `subscription { notification { id name age } }`,
        });
        // This mimics a client connecting to the subscription
        const iterator = await sharedPubSub.asyncIterableIterator(['POST_ADDED']);

        // 2. Trigger the mutation that calls pubsub.publish
        await apolloServer.executeOperation({
            query: `mutation($user: UserInput!) { createUser(user: $user) }`,
            variables: { user: { name: "Test User", age: 30 } }
        });

        // 3. Pull the next value from the iterator
        const result = await iterator.next();

        // 4. Assertions
        expect(result.done).toBe(false);
        expect(result.value).toEqual(expect.objectContaining({
            notification: {
                id: expect.any(Number),
                name: expect.any(String),
                age: expect.any(Number),
            }
        }));
    }, 10000);
});