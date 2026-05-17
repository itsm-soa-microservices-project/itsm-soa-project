const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "request.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef).proto.request;

const client = new grpcObject.RequestService(
  process.env.REQUEST_SERVICE_ADDR || "localhost:5003",
  grpc.credentials.createInsecure()
);

const createRequest = (data) => {
  return new Promise((resolve, reject) => {
    client.CreateRequest({ request: data }, (err, response) => {
      if (err) reject(err);
      else resolve(response.request);
    });
  });
};

const getRequests = () => {
  return new Promise((resolve, reject) => {
    client.ListRequests({}, (err, response) => {
      if (err) reject(err);
      else resolve(response.requests);
    });
  });
};

module.exports = {
  createRequest,
  getRequests
};