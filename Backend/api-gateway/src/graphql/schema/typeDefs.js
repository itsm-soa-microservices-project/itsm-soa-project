const { gql } = require("graphql-tag");

const typeDefs = gql`

  type User {
    id: ID
    username: String
  }

  type Request {
    id: ID
    title: String
    status: String
  }

  type Incident {
    id: ID
    title: String
    priority: String
  }

  type Query {
    getRequests: [Request]
    getIncidents: [Incident]
  }

  type Mutation {
    register(username: String, password: String): User
    login(username: String, password: String): String

    createRequest(
      title: String,
      description: String,
      userId: String
    ): Request

    createIncident(
      title: String,
      description: String,
      priority: String
    ): Incident
  }
`;

module.exports = typeDefs;