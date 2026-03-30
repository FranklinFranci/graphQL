import { ApolloServer } from 'apollo-server-express';
import { resolvers } from '../resolvers/resolvers';
import { typeDefs } from '../schema/schemas';
import { PubSub } from 'graphql-subscriptions';

const mockPublish = jest.fn();
jest.mock('graphql-subscriptions', () => {
    return {
        PubSub: jest.fn().mockImplementation(() => ({
            publish: (...args: any) => mockPublish(...args),
            asyncIterator: jest.fn(),
        })),
    };
});

describe("Testing GraphQL Mutations", () => {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => ({ pubsub: new PubSub() })
    });

    beforeEach(() => {
        mockPublish.mockClear();
    });

    it('Create a new User', async () => {
        const response = await apolloServer.executeOperation({
            query: `mutation($user: UserInput!) { createUser(user: $user) }`,
            variables: {
                user: { name: "Test User", age: 30 }
            }
        });

        expect(response.errors).toBeUndefined();
        expect(response.data?.createUser).toBe("Created successfully..!");

        expect(mockPublish).toHaveBeenCalledWith('POST_ADDED', expect.objectContaining({
            notification: {
                id: expect.any(Number),
                name: expect.any(String),
                age: expect.any(Number),
            }
        }));
    });
});
