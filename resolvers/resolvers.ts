import { dbk_user } from "../databank/dbk_user";
import { dbk_user_details } from "../databank/dbk_user_details";
import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub();
export const resolvers = {
    Query: {
        hello: () => 'Hello world!',
        users: () =>
            dbk_user.map((user: any) => {
                let details = dbk_user_details.find((x: any) => x.user_id == user.id)
                return {
                    ...user,
                    details: details || null // Nesting the details inside the user object
                }
            }),
        user: (parent: any, { id }: { id: any }, context: any) => {
            const user = dbk_user.find((u: any) => u.id == id);
            return user ? {
                ...user,
                details: dbk_user_details.find((d: any) => d.user_id == user.id) || null
            } : null;

        },
        getUsers: (parent: any, { sex }: { sex: string }, context: any) => {
            const users = dbk_user.filter((u: any) => u.sex?.toLowerCase() == sex?.toLowerCase());
            return {
                users: users,
                count: users.length
            }
        }
    },
    Mutation: {
        createUser: async (_: any, { user }: { user: any }) => {
            let newId = dbk_user.length + 1;
            dbk_user.push({ ...user, id: newId })
            dbk_user_details.push({ ...user.details, user_id: newId });
            pubsub.publish('POST_ADDED', {
                notification: {
                    id: newId,
                    name: user.name,
                    age: user.age
                }
            });
            return "Created successfully..!"
        }
    },
    Subscription: {
        notification: {
            subscribe: () => pubsub.asyncIterableIterator(['POST_ADDED'])
        }
    }

};
