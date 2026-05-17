const requestService = require("../services/request.service");
const kafkaProducer = require("../kafka/producer");

const createRequest = async (call, callback) => {
  try {
    const requestData = call.request.request || call.request;
    const request = await requestService.createRequest(requestData);

    await kafkaProducer.send({
      topic: "REQUEST_CREATED",
      messages: [
        {
          value: JSON.stringify(request)
        }
      ]
    });

    callback(null, { request });
  } catch (err) {
    callback(err, null);
  }
};

const listRequests = async (_, callback) => {
  try {
    const requests = await requestService.getRequests();
    callback(null, { requests, total: requests.length });
  } catch (err) {
    callback(err, null);
  }
};

module.exports = {
  createRequest,
  listRequests
};