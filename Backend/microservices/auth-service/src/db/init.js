const fs = require("fs");
const path = require("path");
const { db } = require("./connection");

const schemaPath = path.join(__dirname, "schema.sql");

function runSql(sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function getExistingColumns() {
  return new Promise((resolve, reject) => {
    db.all("PRAGMA table_info(users);", (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows.map((row) => row.name));
    });
  });
}

async function ensureUsersSchema() {
  const schemaSql = fs.readFileSync(schemaPath, "utf-8");
  await runSql(schemaSql);

  const columns = await getExistingColumns();
  const expectedColumns = [
    { name: "email", definition: "TEXT UNIQUE" },
    { name: "name", definition: "TEXT" },
    { name: "created_at", definition: "INTEGER" },
    { name: "updated_at", definition: "INTEGER" },
  ];

  for (const column of expectedColumns) {
    if (!columns.includes(column.name)) {
      await runSql(`ALTER TABLE users ADD COLUMN ${column.name} ${column.definition};`);
    }
  }
}

async function initDb() {
  await ensureUsersSchema();
}

module.exports = { initDb };
