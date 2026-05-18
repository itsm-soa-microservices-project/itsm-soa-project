const { gql } = require("graphql-tag");

const typeDefs = gql`
  type User {
    id: ID
    email: String
    name: String
    roles: [String]
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Request {
    id: ID
    title: String
    description: String
    category: String
    priority: String
    status: String
    userId: String
    assigneeId: String
    createdAt: String
    updatedAt: String
  }

  type Incident {
    id: ID
    title: String
    description: String
    status: String
    priority: String
    reporterId: String
    assigneeId: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    ping: String
    getRequests: [Request]
    getIncidents: [Incident]
  }

  type Mutation {
    register(email: String!, password: String!, name: String): AuthPayload
    login(email: String!, password: String!): AuthPayload

    createRequest(
      title: String!,
      description: String,
      userId: String,
      category: String,
      priority: String
    ): Request

    createIncident(
      title: String!,
      description: String,
      priority: String
    ): Incident
  }
`;

module.exports = typeDefs;