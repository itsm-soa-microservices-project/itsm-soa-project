const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync(
  "../../proto/request.proto"
);

const grpcObject =
  grpc.loadPackageDefinition(packageDef);

const requestPackage = grpcObject.request;

const client = new requestPackage.RequestService(
  "localhost:5003",
  grpc.credentials.createInsecure()
);

const createRequest = (data) => {
  return new Promise((resolve, reject) => {
    client.CreateRequest(data, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
};

const getRequests = () => {
  return new Promise((resolve, reject) => {
    client.GetRequests({}, (err, response) => {
      if (err) reject(err);
      else resolve(response.requests);
    });
  });
};

module.exports = {
  createRequest,
  getRequests
};