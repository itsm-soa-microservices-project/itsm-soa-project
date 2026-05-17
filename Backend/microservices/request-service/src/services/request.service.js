const requestModel = require("../models/request.model");
const { randomUUID } = require("crypto");

const createRequest = async (data) => {
  const request = {
    id: randomUUID(),
    title: data.title || "Untitled request",
    description: data.description || "",
    category: data.category || "GENERAL",
    priority: data.priority || "MEDIUM",
    status: "OPEN",
    userId: data.userId || "anonymous",
    assigneeId: data.assigneeId || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
