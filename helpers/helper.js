const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret';
const getDb = require('../db/conn').getDb;

const findUserByToken = (token) => new Promise((resolve, reject) => {
  if (!token) reject('No jwt provided');

  // first verify the token with jwt.verify
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) reject(err);
    if (!decoded) reject('Invalid jwt');

    // if the token has expired, then reject
    if (decoded.exp < Date.now() / 1000) reject('Invalid jwt');

    // if the token is valid, then query the database for the user
    const db = getDb();
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [decoded.id], (err, results) => {
      if (err) reject(err);
      if (results.length === 0) reject('Invalid jwt');
      resolve(results);
    });
  });
});

module.exports = { findUserByToken, SECRET };