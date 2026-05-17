const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/incident-service";
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log(`MongoDB connected to ${mongoUri}`);
};

module.exports = connectDB;
