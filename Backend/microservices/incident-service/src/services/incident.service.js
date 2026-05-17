const Incident = require("../models/incident.model");

const formatIncident = (incident) => {
  if (!incident) return null;

  return {
    id: incident._id.toString(),
    title: incident.title || "",
    description: incident.description || "",
    status: incident.status || "OPEN",
    reporterId: incident.reporterId || "",
    assigneeId: incident.assigneeId || "",
    createdAt: incident.createdAt ? incident.createdAt.getTime() : 0,
    updatedAt: incident.updatedAt ? incident.updatedAt.getTime() : 0
  };
};

const createIncident = async (incidentData) => {
  const payload = {
    title: incidentData.title,
    description: incidentData.description || "",
    status: incidentData.status || "OPEN",
    reporterId: incidentData.reporterId || incidentData.reporter_id || "",
    assigneeId: incidentData.assigneeId || incidentData.assignee_id || ""
  };

  const incident = await Incident.create(payload);
  return formatIncident(incident);
};

const getIncidentById = async (id) => {
  const incident = await Incident.findById(id);
  return formatIncident(incident);
};

const listIncidents = async ({ page = 1, pageSize = 20, status } = {}) => {
  const query = {};
  if (status) query.status = status;

  const skip = (page - 1) * pageSize;
  const [incidents, total] = await Promise.all([
    Incident.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
    Incident.countDocuments(query)
  ]);

  return {
    incidents: incidents.map(formatIncident),
    total
  };
};

const updateIncident = async (incidentData) => {
  const id = incidentData.id || incidentData._id;
  const updatePayload = {};

  if (incidentData.title !== undefined) updatePayload.title = incidentData.title;
  if (incidentData.description !== undefined) updatePayload.description = incidentData.description;
  if (incidentData.status !== undefined) updatePayload.status = incidentData.status;
  if (incidentData.reporterId !== undefined) updatePayload.reporterId = incidentData.reporterId;
  if (incidentData.reporter_id !== undefined) updatePayload.reporterId = incidentData.reporter_id;
  if (incidentData.assigneeId !== undefined) updatePayload.assigneeId = incidentData.assigneeId;
  if (incidentData.assignee_id !== undefined) updatePayload.assigneeId = incidentData.assignee_id;

  if (Object.keys(updatePayload).length === 0) {
    return null;
  }

  updatePayload.updatedAt = Date.now();
  const incident = await Incident.findByIdAndUpdate(id, updatePayload, { new: true });
  return formatIncident(incident);
};

const deleteIncident = async (id) => {
  const deleted = await Incident.findByIdAndDelete(id);
  return !!deleted;
};

module.exports = {
  createIncident,
  getIncidentById,
  listIncidents,
  updateIncident,
  deleteIncident
};
