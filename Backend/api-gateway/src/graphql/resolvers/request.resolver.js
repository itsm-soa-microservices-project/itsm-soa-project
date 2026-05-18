const requestClient = require("../../grpc-clients/request.client");

const resolvers = {
  Query: {
    getRequests: async () => {
      return await requestClient.getRequests();
    }
  },

  Mutation: {
    createRequest: async (_, args) => {
      const payload = {
        title: args.title,
        description: args.description,
        category: args.category,
        priority: args.priority,
        requester_id: args.userId
      };
      return await requestClient.createRequest(payload);
    }
  }
};

module.exports = resolvers;