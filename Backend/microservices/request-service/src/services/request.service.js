const requestModel = require("../models/request.model");

const { randomUUID } = require("crypto");

const createRequest = async (data) => {

  const request = {
    id: randomUUID(),

    title: data.title,

    description: data.description,

    category: data.category,

    priority: data.priority || "MEDIUM",

    status: "OPEN",

    userId: data.userId,

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString()
  };

  return await requestModel.insertRequest(request);
};

const getRequests = async () => {
  return await requestModel.findAllRequests();
};

module.exports = {
  createRequest,
  getRequests
};
