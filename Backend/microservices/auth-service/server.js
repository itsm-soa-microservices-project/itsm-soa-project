require("dotenv").config();

const { initDb } = require("./src/db/init");
const { startGrpcServer } = require("./src/grpc/server");

async function start() {
  await initDb();
  await startGrpcServer();
}

start();