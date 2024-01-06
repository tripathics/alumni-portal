const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;
const db = require('../db/conn').getDb();

const authenticate = async (req, res, next) => {
  const token = req.cookies.auth;

  try {
    const decoded = jwt.verify(token, SECRET);

    // check if token has expired
    if (decoded.exp < Date.now() / 1000) throw new Error('Invalid jwt');

    // query for user
    const results = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
    if (results.length === 0) throw new Error('Invalid jwt');
    req.user = results[0];
    next();
  } catch (err) {
    // log error
    console.log(err.message);
    if (err.message === 'Invalid jwt')
      res.clearCookie('auth').status(400).json({ message: 'Invalid jwt', error: true });
    else
      res.status(400).json({ message: err.message, error: true });
  }
}

module.exports = authenticate;