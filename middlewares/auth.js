const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;
const db = require('../db/conn_new').getDb();

const authenticate = async (req, res, next) => {
  const token = req.cookies.auth;

  try {
    const decoded = jwt.verify(token, SECRET);
    const [results] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
    if (results.length === 0) throw new Error('Invalid jwt');
    req.user = results[0];
    next();
  } catch (err) {
    // log error
    console.log(err.message);
    if (err instanceof jwt.TokenExpiredError) {
      res.clearCookie('auth').status(401).json({ message: 'Token expired', error: true });
      return;
    } else if (err instanceof jwt.JsonWebTokenError || err.message === 'Invalid jwt') {
      res.clearCookie('auth').status(401).json({ message: 'Invalid jwt', error: true });
      return;
    } else {
      res.status(401).json({ message: err.message, error: true });
    }
  }
}

module.exports = authenticate;