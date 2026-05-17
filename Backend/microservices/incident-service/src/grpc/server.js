const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const handler = require("./handler");

const PROTO_PATH = path.join(__dirname, "..", "..", "..", "..", "proto", "incident.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const incidentProto = grpc.loadPackageDefinition(packageDefinition).proto.incident;

const server = new grpc.Server();

server.addService(incidentProto.IncidentService.service, {
  CreateIncident: handler.createIncident,
  GetIncident: handler.getIncident,
  ListIncidents: handler.listIncidents,
  UpdateIncident: handler.updateIncident,
  DeleteIncident: handler.deleteIncident
});

const startGrpc = () => {
  const port = process.env.PORT || "5002";
  const address = `0.0.0.0:${port}`;

  server.bindAsync(
    address,
    grpc.ServerCredentials.createInsecure(),
    (err) => {
      if (err) {
        console.error("Failed to start Incident gRPC server:", err);
        return;
      }
      console.log(`Incident gRPC running on ${address}`);
      server.start();
    }
  );
};

module.exports = startGrpc;
