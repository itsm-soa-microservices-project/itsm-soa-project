require("dotenv").config();

const connectDB = require("./src/config/db");
const startGrpc = require("./src/grpc/server");

async function start() {
  await connectDB();
  await startGrpc();
}

start().catch((err) => {
  console.error("Incident service failed to start:", err);
  process.exit(1);
});
