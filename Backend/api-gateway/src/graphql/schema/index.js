const typeDefs = require("./typeDefs");
const authResolver = require("../resolvers/auth.resolver");
const requestResolver = require("../resolvers/request.resolver");
const incidentResolver = require("../resolvers/incident.resolver");

const resolvers = {
  Query: {
    ...authResolver.Query,
    ...requestResolver.Query,
    ...incidentResolver.Query
  },
  Mutation: {
    ...authResolver.Mutation,
    ...requestResolver.Mutation,
    ...incidentResolver.Mutation
  }
};

module.exports = { typeDefs, resolvers };