const mysql = require('mysql2/promise');

/** @type {import('mysql2/promise').Connection} */
var _db;

module.exports = {
  connectToServer: async function (cb) {
    try {
      const db = await mysql.createConnection({
        uri: process.env.DB_URI,
        Promise: require('bluebird')
      })
      db.connect();
      console.log('DB connection established. Connected to', db.config.database);
      _db = db;
      if (!_db) {
        throw new Error('Database connection not established. Call connectToServer first.');
      }
      cb();
    } catch (err) {
      console.error('DB connection error: ' + err.message);
    }
  },
  getDb: () => {
    if (!_db) {
      throw new Error('Database connection not established. Call connectToServer first.');
    }
    return _db;
  }
}