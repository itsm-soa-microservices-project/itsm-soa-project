let incidents = [];
let nextId = 1;

const createIncident = async (incidentData = {}) => {
  const incident = {
    id: nextId++,
    title: incidentData.title || '',
    description: incidentData.description || '',
    status: incidentData.status || 'OPEN',
    reporter_id: incidentData.reporter_id || 0,
    assignee_id: incidentData.assignee_id || 0,
    created_at: Date.now(),
    updated_at: Date.now()
  };
  incidents.push(incident);
  return incident;
};

const getIncidentById = async (id) => {
  return incidents.find((incident) => Number(incident.id) === Number(id)) || null;
};

const listIncidents = async ({ page = 1, pageSize = 10, status } = {}) => {
  let filtered = incidents;
  if (status) {
    filtered = filtered.filter((incident) => incident.status === status);
  }

  const startIndex = (page - 1) * pageSize;
  const pagedIncidents = filtered.slice(startIndex, startIndex + pageSize);

  return {
    incidents: pagedIncidents,
    total: filtered.length
  };
};

const updateIncident = async (incidentData = {}) => {
  const existing = await getIncidentById(incidentData.id);
  if (!existing) {
    return null;
  }

  Object.assign(existing, {
    title: incidentData.title || existing.title,
    description: incidentData.description || existing.description,
    status: incidentData.status || existing.status,
    reporter_id: incidentData.reporter_id || existing.reporter_id,
    assignee_id: incidentData.assignee_id || existing.assignee_id,
    updated_at: Date.now()
  });

  return existing;
};

const deleteIncident = async (id) => {
  const index = incidents.findIndex((incident) => Number(incident.id) === Number(id));
  if (index === -1) {
    return false;
  }
  incidents.splice(index, 1);
  return true;
};

module.exports = {
  createIncident,
  getIncidentById,
  listIncidents,
  updateIncident,
  deleteIncident
};
