const incidentService = require("../services/incident.service");

const createIncident = async (call, callback) => {
  try {
    const data = call.request;

    const result = await incidentService.createIncident(data);

    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

module.exports = {
  createIncident,
};