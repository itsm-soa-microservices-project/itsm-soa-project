const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "incident.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef).proto.incident;

const client = new grpcObject.IncidentService(
  process.env.INCIDENT_SERVICE_ADDR || "localhost:5002",
  grpc.credentials.createInsecure()
);

const createIncident = (data) => {
  return new Promise((resolve, reject) => {
    client.CreateIncident({ incident: data }, (err, response) => {
      if (err) reject(err);
      else resolve(response.incident);
    });
  });
};

const getIncidents = () => {
  return new Promise((resolve, reject) => {
    client.ListIncidents({}, (err, response) => {
      if (err) reject(err);
      else resolve(response.incidents);
    });
  });
};

module.exports = {
  createIncident,
  getIncidents
};