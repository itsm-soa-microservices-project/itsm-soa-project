const { getDB } = require("../rxdb/database");

const insertRequest = async (requestData) => {
  const db = getDB();
  const created = await db.requests.insert(requestData);
  return created.toJSON();
};

const findAllRequests = async () => {
  const db = getDB();
  const results = await db.requests.find().exec();
  return results.map((doc) => doc.toJSON());
};

module.exports = {
  insertRequest,
  findAllRequests
};
