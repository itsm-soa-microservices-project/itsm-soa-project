const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const handler = require("./handler");

const PROTO_PATH = path.join(__dirname, "..", "..", "..","..", "proto", "request.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const requestPackage = grpcObject.proto.request;
const server = new grpc.Server();

server.addService(requestPackage.RequestService.service, {
  CreateRequest: handler.createRequest,
  ListRequests: handler.listRequests
});

const startGrpcServer = () => {
  server.bindAsync(
    "0.0.0.0:5003",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("Request gRPC bind error:", err);
        return;
      }

      console.log(`Request gRPC running on port ${port}`);
      server.start();
    }
  );
};

module.exports = startGrpcServer;
