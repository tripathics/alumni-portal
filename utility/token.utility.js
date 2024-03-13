import { createRequire } from 'module';
import jwt from 'jsonwebtoken';

const require = createRequire(import.meta.url);
require('dotenv').config();

const secret = process.env.JWT_SECRET;

/**
 * Generate and return JWT token
 * having expiration time of 1hr
 */
const genToken = (id) => {
  if (!id) return undefined;
  return jwt.sign({ id }, secret, { expiresIn: '1h' });
};

export default genToken;
