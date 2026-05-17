const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const handler = require('./handler');

const PROTO_PATH = path.join(__dirname, '..', '..', '..', '..', 'proto', 'incident.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  arrays: true
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

module.exports = {
  start: (port) => {
    server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
      if (err) {
        throw err;
      }
      server.start();
      console.log(`Incident gRPC server listening on ${bindPort}`);
    });
  }
};
