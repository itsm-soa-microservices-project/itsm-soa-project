const { Kafka, logLevel } = require("kafkajs");
const notificationService = require("../services/notification.service");

const {
  KAFKA_BROKER = "localhost:9092",
  KAFKA_CLIENT_ID = "notification-service",
  KAFKA_GROUP_ID = "notification-service-group",
  KAFKA_RETRY_DELAY_MS = "5000",
  KAFKA_RETRY_COUNT = "-1"
} = process.env;

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [KAFKA_BROKER],
  logLevel: logLevel.NOTHING
});

const consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID });
const topics = ["REQUEST_CREATED", "INCIDENT_CREATED"];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startConsumer = async () => {
  const retryDelay = Number(KAFKA_RETRY_DELAY_MS) || 5000;
  const maxRetries = Number(KAFKA_RETRY_COUNT);
  let attempt = 0;

  while (true) {
    try {
      attempt += 1;
      console.log(`Connecting to Kafka broker ${KAFKA_BROKER} (attempt ${attempt})`);
      await consumer.connect();

      for (const topic of topics) {
        await consumer.subscribe({ topic, fromBeginning: false });
      }

      console.log(`Notification consumer subscribed to topics: ${topics.join(", ")}`);

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const raw = message.value ? message.value.toString() : "";
          let payload = null;

          try {
            payload = JSON.parse(raw);
          } catch (err) {
            console.warn(`Invalid JSON message on topic ${topic}:`, raw);
            return;
          }

          try {
            await notificationService.processEvent(topic, payload);
          } catch (err) {
            console.error(`Failed to process event from ${topic}:`, err);
          }
        }
      });

      break;
    } catch (err) {
      console.error("Kafka consumer start failed:", err);

      if (maxRetries >= 0 && attempt >= maxRetries) {
        throw err;
      }

      console.log(`Retrying Kafka connection in ${retryDelay}ms...`);
      await sleep(retryDelay);
    }
  }
};

module.exports = {
  startConsumer
};