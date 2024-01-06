const jwt = require('jsonwebtoken');
const db = require('../db/conn').getDb();
const SECRET = process.env.JWT_SECRET;

/**
 * This middleware checks if the user is already logged in and clears the cookie if so.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const clearCookie = (req, res, next) => {
  const token = req.cookies.auth;
  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.exp < Date.now() / 1000) return next();

    db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (err, results) => {
      if (err) return next();
      if (results.length === 0) return next();
      res.clearCookie('auth').json({ messge: 'User already logged in', error: true });
    })
  } catch (err) {
    next();
  }
}

module.exports = clearCookie;