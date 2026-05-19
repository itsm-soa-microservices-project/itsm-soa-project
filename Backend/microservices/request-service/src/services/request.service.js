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

const getRequestById = async (id) => {
  return requestModel.findRequestById(id);
};

const updateRequest = async (data) => {
  if (!data?.id) {
    throw new Error("Request id is required");
  }

  const patch = {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.category !== undefined && { category: data.category }),
    ...(data.priority !== undefined && { priority: data.priority }),
    ...(data.status !== undefined && { status: data.status }),
    ...(data.requester_id !== undefined && { userId: String(data.requester_id) }),
    ...(data.requesterId !== undefined && { userId: String(data.requesterId) }),
    ...(data.assignee_id !== undefined && { assigneeId: String(data.assignee_id) }),
    ...(data.assigneeId !== undefined && { assigneeId: String(data.assigneeId) }),
    updatedAt: Date.now()
  };

  return requestModel.updateRequest(data.id, patch);
};

const deleteRequest = async (id) => {
  return requestModel.deleteRequest(id);
};

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest
};
