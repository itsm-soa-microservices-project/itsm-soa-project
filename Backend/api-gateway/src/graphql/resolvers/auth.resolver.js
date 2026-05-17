const authClient = require("../../grpc-clients/auth.client");

const resolvers = {
  Query: {
    ping: () => "pong",
  },
  Mutation: {
    login: (_, { email, password }) => {
      return new Promise((resolve, reject) => {
        authClient.Login({ email, password }, (err, response) => {
          if (err) return reject(err);
          resolve(response);
        });
      });
    },
    register: (_, { email, password, name }) => {
      return new Promise((resolve, reject) => {
        authClient.Register({ email, password, name }, (err, response) => {
          if (err) return reject(err);
          resolve(response);
        });
      });
    },
  },
};

module.exports = resolvers;
