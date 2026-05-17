const grpc = require("@grpc/grpc-js");
const incidentService = require("../services/incident.service");

const createIncident = async (call, callback) => {
  try {
    const incident = await incidentService.createIncident(call.request.incident || call.request);
    callback(null, { incident });
  } catch (err) {
    callback(err, null);
  }
};

const getIncident = async (call, callback) => {
  try {
    const incident = await incidentService.getIncidentById(call.request.id);
    if (!incident) {
      return callback({ code: grpc.status.NOT_FOUND, message: "Incident not found" }, null);
    }
    callback(null, { incident });
  } catch (err) {
    callback(err, null);
  }
};

const listIncidents = async (call, callback) => {
  try {
    const { page, pageSize, status } = call.request;
    const result = await incidentService.listIncidents({ page, pageSize, status });
    callback(null, result);
  } catch (err) {
    callback(err, null);
  }
};

const updateIncident = async (call, callback) => {
  try {
    const incident = await incidentService.updateIncident(call.request.incident);
    if (!incident) {
      return callback({ code: grpc.status.NOT_FOUND, message: "Incident not found or no update data provided" }, null);
    }
    callback(null, { incident });
  } catch (err) {
    callback(err, null);
  }
};

const deleteIncident = async (call, callback) => {
  try {
    const success = await incidentService.deleteIncident(call.request.id);
    callback(null, { success });
  } catch (err) {
    callback(err, null);
  }
};

module.exports = {
  createIncident,
  getIncident,
  listIncidents,
  updateIncident,
  deleteIncident
};
