const { Kafka, logLevel } = require("kafkajs");

const {
  KAFKA_BROKER = "localhost:9092",
  KAFKA_CLIENT_ID = "incident-service"
} = process.env;

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [KAFKA_BROKER],
  logLevel: logLevel.NOTHING
});

const producer = kafka.producer();
let producerConnected = false;

const connectProducer = async () => {
  if (!producerConnected) {
    await producer.connect();
    producerConnected = true;
    console.log("Incident Kafka producer connected");
  }
};

const send = async ({ topic, messages }) => {
  await connectProducer();
  return producer.send({ topic, messages });
};

module.exports = {
  connectProducer,
  send
};
