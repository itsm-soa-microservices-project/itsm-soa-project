const { createRxDatabase } = require("rxdb");

const {
  getRxStorageMemory
} = require("rxdb/plugins/storage-memory");

const requestSchema = require("./request.schema");

let db;

const connectDB = async () => {

  db = await createRxDatabase({
    name: "requestdb",
    storage: getRxStorageMemory()
  });

  await db.addCollections({
    requests: {
      schema: requestSchema
    }
  });

  console.log("RxDB connected");

  return db;
};

const getDB = () => db;

module.exports = {
  connectDB,
  getDB
};