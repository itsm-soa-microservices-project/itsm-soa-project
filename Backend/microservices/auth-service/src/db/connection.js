const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const databasePath = path.join(__dirname, "..", "..", "db.sqlite");
const db = new sqlite3.Database(databasePath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error("Unable to open SQLite database:", err.message);
    process.exit(1);
  }
});

module.exports = { db };
