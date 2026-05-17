const { getDB } = require("../rxdb/database");

const insertRequest = async (requestData) => {

  const db = getDB();

  return await db.requests.insert(requestData);
};

const findAllRequests = async () => {

  const db = getDB();

  return await db.requests.find().exec();
};

const findRequestById = async (id) => {

  const db = getDB();

  return await db.requests
    .findOne({
      selector: { id }
    })
    .exec();
};

module.exports = {
  insertRequest,
  findAllRequests,
  findRequestById
};