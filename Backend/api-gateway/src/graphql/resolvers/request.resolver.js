const requestClient =
  require("../../grpc/clients/request.client");

const resolvers = {
  Query: {
    getRequests: async () => {
      return await requestClient.getRequests();
    }
  },

  Mutation: {
    createRequest: async (_, args) => {
      return await requestClient.createRequest(args);
    }
  }
};

module.exports = resolvers;