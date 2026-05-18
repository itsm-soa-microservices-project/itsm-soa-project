const requestModel = require("../models/request.model");

const createRequest = async (data) => {
  const request = {
    id: String(Date.now() * 1000 + Math.floor(Math.random() * 1000)),
    title: data.title || "Untitled request",
    description: data.description || "",
    category: data.category || "GENERAL",
    priority: data.priority || "MEDIUM",
    status: "OPEN",
    userId: data.userId || data.requester_id || data.requesterId || "anonymous",
    assigneeId: data.assigneeId || data.assignee_id || data.assigneeId || "",
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  return requestModel.insertRequest(request);
};

const getRequests = async () => {
  return requestModel.findAllRequests();
};

module.exports = {
  createRequest,
  getRequests
};
