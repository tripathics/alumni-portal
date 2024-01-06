const mysql = require('mysql2');

/** @type {import('mysql2').Connection} */
var _db;

module.exports = {
  connectToServer: function (callback) {
    const db = mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_USER_PASSWORD || 'rootpass',
      database: process.env.DB_NAME || 'alumniDatabase'
    });

    db.connect(function (err) {
      if (err) {
        return console.error('error: ' + err.message);
      }
      _db = db;

      console.log(`Connected to the MySQL "${process.env.DB_NAME || 'alumniDatabase'}" database.`);
      callback();
    })
  },

  getDb: () => {
    if (!_db) {
      throw new Error('Database connection not established. Call connectToServer first.');
    }
    return _db;
  }
};