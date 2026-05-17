const requestService = require("../services/request.service");

const kafkaProducer = require("../kafka/producer");

const createRequest = async (call, callback) => {

  try {

    const request =
      await requestService.createRequest(
        call.request
      );

    // Kafka Event
    await kafkaProducer.send({
      topic: "REQUEST_CREATED",

      messages: [
        {
          value: JSON.stringify(request)
        }
      ]
    });

    callback(null, request);

  } catch (err) {

    callback(err, null);
  }
};

const getRequests = async (_, callback) => {

  try {

    const requests =
      await requestService.getRequests();

    callback(null, {
      requests
    });

  } catch (err) {

    callback(err, null);
  }
};

module.exports = {
  createRequest,
  getRequests
};