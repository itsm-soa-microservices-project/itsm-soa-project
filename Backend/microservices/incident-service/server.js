require("dotenv").config();

const connectDB = require("./src/config/db");
const startGrpc = require("./src/grpc/server");

async function start() {
  await connectDB();
  startGrpc();
}

start();
