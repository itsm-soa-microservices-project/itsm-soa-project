const { connectDB } = require("./src/rxdb/database");
const startGrpc = require("./src/grpc/server");

const start = async () => {
  await connectDB();
  startGrpc();
};

start().catch((err) => {
  console.error("Request service failed to start:", err);
  process.exit(1);
});
