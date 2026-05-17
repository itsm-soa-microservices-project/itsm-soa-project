require('dotenv').config();
const notificationConsumer = require('./src/kafka/consumer');

const start = async () => {
  await notificationConsumer.start();
  console.log('Notification service running');
};

start().catch((err) => {
  console.error('Notification service failed to start', err);
  process.exit(1);
});
