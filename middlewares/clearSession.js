import jwt from 'jsonwebtoken';
import getDb from '../db/conn_new_new.js';

const db = await getDb();
const SECRET = process.env.JWT_SECRET;

/**
 * This middleware checks if the user is already logged in and
 * clears the cookie and signs the user out if they are already logged in
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
      res.status(400).clearCookie('auth').json({
        message: 'User has been logged out.',
        error: true,
      });
    });
  } catch (err) {
    next();
  }
};

export default clearCookie;
