import { ApolloServer } from 'apollo-server-express';
import { resolvers } from '../resolvers/resolvers';
import { typeDefs } from '../schema/schemas';
describe('Using Jest to test GraphQL queries', () => {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });
    it('Query Hello', async () => {
        const responseHello = await apolloServer.executeOperation({
            query: 'query{ hello }',
        });
        expect(responseHello?.errors).toBeUndefined();
        expect(responseHello.data?.hello).toBe('Hello world!');
    });
    it('Query Users', async () => {
        const responseUsers = await apolloServer.executeOperation({
            query: 'query{ users { id name age } }',
        });
        expect(responseUsers?.errors).toBeUndefined();
        expect(responseUsers.data?.users).not.toBeUndefined();
        expect(responseUsers.data?.users).toEqual(
            expect.arrayContaining([
                {
                    id: expect.any(String),
                    name: expect.any(String),
                    age: expect.any(Number)
                }
            ])
        );
    });
    it('Query a Specific User', async () => {
        const responseUsers = await apolloServer.executeOperation({
            query: 'query{ user(id: "1") { id name age } }',
        });
        expect(responseUsers?.errors).toBeUndefined();
        expect(responseUsers.data?.user).not.toBeUndefined();
        expect(responseUsers.data?.user).toEqual(expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            age: expect.any(Number)
        }));
        expect(responseUsers.data?.user).toEqual({ id: '1', name: 'Franco Franics', age: 42 });
    });
    it('Query a Specific set of Users where SEX: "Male"', async () => {
        const responseUsers = await apolloServer.executeOperation({
            query: `query{ getUsers(sex: "Male") { 
            __typename
            ... on Users{users{id name age}}
             } }`,
        });
        expect(responseUsers?.errors).toBeUndefined();
        expect(responseUsers.data?.getUsers.users).not.toBeUndefined();
        expect(responseUsers.data?.getUsers.users).toEqual(expect.arrayContaining([
            {
                id: expect.any(String),
                name: expect.any(String),
                age: expect.any(Number)
            }
        ]));
    });
    it('Query a Specific set of Users where SEX: "FEMALE"', async () => {
        const responseUsers = await apolloServer.executeOperation({
            query: `query{ getUsers(sex: "Female") { 
            __typename
            ...on Users{ users{ id name age }}
             }}`,
        });
        expect(responseUsers?.errors).toBeUndefined();
        expect(responseUsers.data?.getUsers.users).not.toBeUndefined();
        expect(responseUsers.data?.getUsers.users).toEqual(expect.arrayContaining([
            {
                id: expect.any(String),
                name: expect.any(String),
                age: expect.any(Number)
            }
        ]));
    });
});