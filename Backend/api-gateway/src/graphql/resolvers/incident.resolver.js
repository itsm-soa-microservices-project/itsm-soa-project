const incidentClient =
  require("../../grpc/clients/incident.client");

const resolvers = {
  Query: {
    getIncidents: async () => {
      return await incidentClient.getIncidents();
    }
  },

  Mutation: {
    createIncident: async (_, args) => {
      return await incidentClient.createIncident(args);
    }
  }
};

module.exports = resolvers;