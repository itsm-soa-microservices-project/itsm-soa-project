const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { Register, Login } = require("./handler");

const PROTO_PATH = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "proto",
  "auth.proto"
);
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const authProto = grpc.loadPackageDefinition(packageDefinition).proto.auth;

function startGrpcServer() {
  return new Promise((resolve, reject) => {
    const server = new grpc.Server();
    server.addService(authProto.AuthService.service, { Register, Login });

    const port = process.env.PORT || "50051";
    const address = `0.0.0.0:${port}`;

    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err) => {
      if (err) {
        return reject(err);
      }
      server.start();
      console.log(`gRPC auth server listening on ${address}`);
      resolve(server);
    });
  });
}

module.exports = { startGrpcServer };
