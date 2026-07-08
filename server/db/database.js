


// Uses Node's built-in node:sqlite (no native addon, no compiler needed --
// available without a flag from Node v22.13.0 / v23.4.0 onward).
const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'app.db');
const raw = new DatabaseSync(DB_PATH);
raw.exec('PRAGMA journal_mode = WAL;');
raw.exec('PRAGMA foreign_keys = ON;');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
raw.exec(schema);

const db = {
  exec: (sql) => raw.exec(sql),
  prepare: (sql) => raw.prepare(sql)
};

module.exports = db;
