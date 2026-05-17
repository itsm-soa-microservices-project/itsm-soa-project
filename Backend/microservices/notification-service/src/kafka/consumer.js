const { Kafka, logLevel } = require('kafkajs');
const notificationService = require('../services/notification.service');

const {
  KAFKA_BROKER = 'localhost:9092',
  KAFKA_CLIENT_ID = 'notification-service',
  REQUEST_TOPIC = 'REQUEST_CREATED'
} = process.env;

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [KAFKA_BROKER],
  logLevel: logLevel.NOTHING
});

const consumer = kafka.consumer({ groupId: 'notification-service-group' });

const start = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: REQUEST_TOPIC, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const payload = message.value ? message.value.toString() : null;
      const requestData = payload ? JSON.parse(payload) : null;
      console.log(`Notification consumer received ${topic}:`, requestData);
      await notificationService.sendNotification({
        topic,
        request: requestData
      });
    }
  });
};

module.exports = {
  start
};
