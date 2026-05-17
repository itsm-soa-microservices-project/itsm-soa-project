const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "incident-service",
  brokers: ["localhost:9092"]
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
};

const send = async ({ topic, messages }) => {
  await producer.send({
    topic,
    messages
  });
};

module.exports = {
  connectProducer,
  send
};