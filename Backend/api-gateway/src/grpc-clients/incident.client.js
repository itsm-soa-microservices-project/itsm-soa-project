const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync(
  "../../proto/incident.proto"
);

const grpcObject =
  grpc.loadPackageDefinition(packageDef);

const incidentPackage = grpcObject.incident;

const client =
  new incidentPackage.IncidentService(
    "localhost:5002",
    grpc.credentials.createInsecure()
  );

const createIncident = (data) => {
  return new Promise((resolve, reject) => {
    client.CreateIncident(data, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
};

const getIncidents = () => {
  return new Promise((resolve, reject) => {
    client.GetIncidents({}, (err, response) => {
      if (err) reject(err);
      else resolve(response.incidents);
    });
  });
};

module.exports = {
  createIncident,
  getIncidents
};