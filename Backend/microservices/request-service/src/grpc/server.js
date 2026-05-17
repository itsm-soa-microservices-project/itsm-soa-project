const grpc = require("@grpc/grpc-js");

const protoLoader =
  require("@grpc/proto-loader");

const handler = require("./handler");

const packageDef =
  protoLoader.loadSync(
    "../../proto/request.proto"
  );

const grpcObject =
  grpc.loadPackageDefinition(packageDef);

const requestPackage =
  grpcObject.request;

const server = new grpc.Server();

server.addService(
  requestPackage.RequestService.service,

  {
    CreateRequest:
      handler.createRequest,

    GetRequests:
      handler.getRequests
  }
);

const startGrpcServer = () => {

  server.bindAsync(

      "0.0.0.0:5003",

      grpc.ServerCredentials.createInsecure(),

      (err, port) => {
        if (err) {
          console.error("gRPC bind error:", err);
          return;
        }

        console.log(
          `Request gRPC running on port ${port}`
        );

        server.start();
      }
  );
};

module.exports = startGrpcServer;