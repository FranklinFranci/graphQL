import { gql } from 'apollo-server';
export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    age: Int!,
    details:User_Details
  }
    type BasicUser {
    id: ID!
    name: String!
    age: Int!
  }
  type User_Details {
  address1: String!,
  address2: String,
  address3: String,
  pincode:String!,
  state:String!,
  district:String,
  phone_number:String
  }
  type Users{
  users:[BasicUser],
  count:Int!
  }
 
  input UserInput {
    name: String!
    age: Int!,
    details:User_DetailsInput
  }
  input User_DetailsInput {
  address1: String!,
  address2: String,
  address3: String,
  pincode:String!,
  state:String!,
  district:String,
  phone_number:String
  }


 type Query {
    hello: String
    user(id: ID!): User
    users: [User]
    getUsers(sex:String!):Users
  }
  type Mutation {
  createUser(user:UserInput!):String
  }
  type Subscription{
  notification:BasicUser
  }
`;


