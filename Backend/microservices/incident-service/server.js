require('dotenv').config();
const grpcServer = require('./src/grpc/server');
const kafkaProducer = require('./src/kafka/producer');

const PORT = process.env.INCIDENT_SERVICE_PORT || 50052;

const start = async () => {
  await kafkaProducer.connectProducer();
  grpcServer.start(PORT);
  console.log(`Incident service running on port ${PORT}`);
};

start().catch((err) => {
  console.error('Incident service failed to start', err);
  process.exit(1);
});
