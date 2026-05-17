require("dotenv").config();

const { connectDB } = require("./src/rxdb/database");

const startGrpc = require("./src/grpc/server");

const kafkaProducer = require("./src/kafka/producer");

const startConsumer = require("./src/kafka/consumer");

async function start() {

  await connectDB();

  await kafkaProducer.connectProducer();

  await startConsumer();

  startGrpc();
}

start();
