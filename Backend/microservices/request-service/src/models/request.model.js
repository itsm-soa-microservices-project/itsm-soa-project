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

const findRequestById = async (id) => {
  const db = getDB();
  const doc = await db.requests.findOne(id).exec();
  return doc ? doc.toJSON() : null;
};

const updateRequest = async (id, patchData) => {
  const db = getDB();
  const doc = await db.requests.findOne(id).exec();
  if (!doc) {
    return null;
  }
  await doc.atomicPatch(patchData);
  return doc.toJSON();
};

const deleteRequest = async (id) => {
  const db = getDB();
  const doc = await db.requests.findOne(id).exec();
  if (!doc) {
    return false;
  }
  await doc.remove();
  return true;
};

module.exports = {
  insertRequest,
  findAllRequests,
  findRequestById,
  updateRequest,
  deleteRequest
};
