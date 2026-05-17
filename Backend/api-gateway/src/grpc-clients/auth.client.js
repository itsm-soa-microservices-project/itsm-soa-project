const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "auth.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef).proto.auth;

const client = new grpcObject.AuthService(
  process.env.AUTH_SERVICE_ADDR || "localhost:50051",
  grpc.credentials.createInsecure()
);

module.exports = client;