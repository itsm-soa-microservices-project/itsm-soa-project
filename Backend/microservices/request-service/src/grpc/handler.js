const grpc = require("@grpc/grpc-js");
const requestService = require("../services/request.service");
const kafkaProducer = require("../kafka/producer");

const buildGrpcRequest = (request) => ({
  id: request.id,
  title: request.title || "",
  description: request.description || "",
  status: request.status || "",
  requester_id: String(request.userId || request.requester_id || "0"),
  assignee_id: String(request.assigneeId || request.assignee_id || "0"),
  created_at: String(request.createdAt ? new Date(request.createdAt).valueOf() : request.created_at || "0"),
  updated_at: String(request.updatedAt ? new Date(request.updatedAt).valueOf() : request.updated_at || "0"),
  category: request.category || "",
  priority: request.priority || ""
});

const createRequest = async (call, callback) => {
  try {
    const requestData = call?.request?.request;
    if (!requestData || typeof requestData !== "object") {
      return callback(
        {
          code: grpc.status.INVALID_ARGUMENT,
          message: "CreateRequestRequest must include a valid 'request' payload"
        },
        null
      );
    }

    const request = await requestService.createRequest(requestData);

    await kafkaProducer.send({
      topic: "REQUEST_CREATED",
      messages: [{ value: JSON.stringify(request) }]
    });

    callback(null, { request: buildGrpcRequest(request) });
  } catch (err) {
    callback(
      {
        code: grpc.status.INTERNAL,
        message: err.message || "Internal server error"
      },
      null
    );
  }
};

const listRequests = async (_, callback) => {
  try {
    const requests = await requestService.getRequests();
    callback(null, {
      requests: requests.map(buildGrpcRequest),
      total: requests.length
    });
  } catch (err) {
    callback(
      {
        code: grpc.status.INTERNAL,
        message: err.message || "Internal server error"
      },
      null
    );
  }
};

const getRequest = async (call, callback) => {
  try {
    const id = call?.request?.id;
    if (!id) {
      return callback({ code: grpc.status.INVALID_ARGUMENT, message: "Request id is required" }, null);
    }

    const request = await requestService.getRequestById(id);
    if (!request) {
      return callback({ code: grpc.status.NOT_FOUND, message: "Request not found" }, null);
    }

    callback(null, { request: buildGrpcRequest(request) });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message || "Internal server error" }, null);
  }
};

const updateRequest = async (call, callback) => {
  try {
    const requestData = call?.request?.request;
    if (!requestData || typeof requestData !== "object" || !requestData.id) {
      return callback({ code: grpc.status.INVALID_ARGUMENT, message: "UpdateRequestRequest must include a valid request with id" }, null);
    }

    const request = await requestService.updateRequest(requestData);
    if (!request) {
      return callback({ code: grpc.status.NOT_FOUND, message: "Request not found" }, null);
    }

    callback(null, { request: buildGrpcRequest(request) });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message || "Internal server error" }, null);
  }
};

const deleteRequest = async (call, callback) => {
  try {
    const id = call?.request?.id;
    if (!id) {
      return callback({ code: grpc.status.INVALID_ARGUMENT, message: "Request id is required" }, null);
    }

    const success = await requestService.deleteRequest(id);
    callback(null, { success });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message || "Internal server error" }, null);
  }
};

module.exports = {
  createRequest,
  listRequests,
  getRequest,
  updateRequest,
  deleteRequest
};
