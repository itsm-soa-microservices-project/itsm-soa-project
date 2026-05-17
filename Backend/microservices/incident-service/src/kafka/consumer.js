const { Kafka, logLevel } = require('kafkajs');

const {
  KAFKA_BROKER = 'localhost:9092',
  KAFKA_CLIENT_ID = 'incident-service-consumer',
  INCIDENT_TOPIC = 'INCIDENT_CREATED'
} = process.env;

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [KAFKA_BROKER],
  logLevel: logLevel.NOTHING
});

const consumer = kafka.consumer({ groupId: 'incident-service-group' });

const connect = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: INCIDENT_TOPIC, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Incident service consumed ${topic}: ${message.value.toString()}`);
    }
  });
};

module.exports = {
  connect
};
