const { db } = require("../db/connection");

function createUser({ username, email, password, name, created_at, updated_at }) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO users (username, email, password, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);`;
    db.run(query, [username, email, password, name, created_at, updated_at], function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ id: this.lastID, username, email, name, created_at, updated_at });
    });
  });
}

function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE username = ?;`, [username], (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row || null);
    });
  });
}

module.exports = { createUser, findUserByUsername };
