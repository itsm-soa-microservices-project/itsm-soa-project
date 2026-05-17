const typeDefs = `
  type User {
    id: ID!
    email: String
    name: String
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Query {
    ping: String
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    register(email: String!, password: String!, name: String): AuthPayload
  }
`;

module.exports = typeDefs;
