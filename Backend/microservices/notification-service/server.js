require("dotenv").config();

const { startConsumer } = require("./src/kafka/consumer");

const start = async () => {
  await startConsumer();
};

start().catch((err) => {
  console.error("Notification service failed to start:", err);
  process.exit(1);
});