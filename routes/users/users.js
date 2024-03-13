import { Router } from 'express';
import { hash, compare } from 'bcrypt';
import authenticate from '../../middlewares/auth.js';
import clearSession from '../../middlewares/clearSession.js';
import { uploadAvatar } from '../../middlewares/uploadFile.js';

import { profiles as profileKeys, academics as academicKeys, experiences as experienceKeys } from '../../db/schema.js';
import genToken from '../../utility/token.utility.js';
import getDb from '../../db/conn_new_new.js';

const users = Router();
const expiresInMin = 60;

users.route('/register-admin').post(async (req, res, next) => {
  const db = await getDb();
  const { email, password, confirmPassword } = req.body;

  if ((!email || !password || !confirmPassword) || password !== confirmPassword) {
    return next(Error('Invalid API usage / Passwords do not match'));
  }

  try {
    const hashedPassword = await hash(password, 10);
    await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, 'admin']);
    res.status(200).json({
      success: true,
      message: 'User registered',
    });
  } catch (err) {
    next(err);
  }
});

users.route('/register').post(async (req, res, next) => {
  const db = await getDb();
  const { email, password, confirmPassword } = req.body;
  // TODO: verify otp for registration

  if ((!email || !password || !confirmPassword) || password !== confirmPassword) {
    return next('Invalid API usage / Passwords do not match');
  }
  try {
    const hashedPassword = await hash(password, 10);
    const [result] = await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    console.log('New user registered: ', result);
    res.status(200).json({
      success: true,
      message: 'User registered',
    });
  } catch (err) {
    next(err);
  }
});

users.route('/login').post(clearSession, async (req, res, next) => {
  const db = await getDb();
  const { email, password } = req.body;
  try {
    const [result] = await db.query(`SELECT users.*, profiles.title, profiles.firstName, profiles.lastName, profiles.avatar, 
      membership_applications.status = "pending" as profileLocked
      FROM users
      LEFT JOIN profiles ON users.id = profiles.userId
      LEFT JOIN membership_applications ON users.id = membership_applications.userId 
      WHERE users.email = ?`, [email]);
    if (result.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials', success: false });
    }
    const [user] = result;
    const isPasswordMatched = await compare(password, user.password);
    if (!isPasswordMatched) return res.status(400).json({ message: 'Invalid credentials', success: false });
    delete user.password;
    const secret = genToken(user.id);
    if (!secret) throw new Error('Error generating JWT');
    res.cookie('auth', secret, { maxAge: expiresInMin * 60 * 1000, httpOnly: true }).json({
      message: 'User logged in', user, success: true,
    });
  } catch (err) {
    next(err);
  }
});

users.route('/auth').get(authenticate, (req, res) => {
  res.status(200).json({ message: 'User authenticated', success: true });
});

users.route('/logout').post(authenticate, (req, res) => {
  res.clearCookie('auth').json({ message: 'User logged out', success: true });
});

users.route('/profile').get(authenticate, async (req, res, next) => {
  const db = await getDb();
  const { user } = req;
  try {
    const [results] = await db.query('SELECT * FROM profiles WHERE userId = ?', [user.id]);
    res.status(200).json({
      success: true,
      personalDetails: results.length ? { ...results[0] } : null,
    });
  } catch (err) {
    next(err);
  }
});

users.route('/update-profile').post(authenticate, async (req, res, next) => {
  const db = await getDb();
  const { user, body } = req;

  // don't allow if there is already pending membership application as profile is locked
  try {
    const [membershipApplications] = await db.query(`
    SELECT * FROM membership_applications WHERE userId = ? AND status = "pending"
    `, [user.id]);
    if (membershipApplications.length) return res.status(400).json({ message: 'Profile is locked', success: false });

    const keys = profileKeys.filter((key) => body[key] !== undefined && key !== 'userId');
    const placeholders = keys.map(() => '?').join(', ');
    const values = [user.id, ...keys.map((key) => body[key])];
    const sql = `
      INSERT INTO profiles (userId, ${keys.join(', ')})
      VALUES (?, ${placeholders})
      ON DUPLICATE KEY UPDATE ${keys.map((key) => `${key} = VALUES(${key})`).join(', ')}
    `;

    const [results] = await db.query(sql, values);
    console.log(results);
    res.status(200).json({ message: 'Profile updated', success: true });
  } catch (err) {
    next(err);
  }
});

users.route('/update-avatar').post(authenticate, uploadAvatar, async (req, res, next) => {
  const db = await getDb();
  const { user } = req;
  const avatar = req.file;

  try {
    await db.query('UPDATE profiles SET avatar = ? WHERE userId = ?', [avatar?.filename, user.id]);
    res.status(200).json({ message: 'Avatar updated', success: true });
  } catch (err) {
    next(err);
  }
});

users.route('').get(authenticate, async (req, res, next) => {
  const db = await getDb();
  if (req.user.role !== 'admin' && req.query.id) {
    return res.status(401).json({ message: 'Unauthorized', success: false });
  }
  try {
    const id = req.user.role === 'admin' ? req.query.id : req.user.id;
    const [results] = await db.query(`SELECT users.id, users.email, users.role, 
      profiles.title, profiles.firstName, profiles.lastName, profiles.avatar, 
      membership_applications.status = "pending" as profileLocked
      FROM users
      LEFT JOIN profiles ON users.id = profiles.userId
      LEFT JOIN membership_applications ON users.id = membership_applications.userId
      WHERE users.id = ?`, [id]);
    res.status(200).json({
      success: true,
      user: results.length ? { ...results[0] } : null,
    });
  } catch (err) {
    next(err);
  }
});

users.route('/education').post(authenticate, async (req, res, next) => {
  const db = await getDb();
  const { user, body } = req;

  const keys = academicKeys.filter((key) => body[key] !== undefined && key !== 'userId');

  const placeholders = keys.map(() => '?').join(', ');
  const values = [user.id, ...keys.map((key) => body[key])];
  const sql = `
    INSERT INTO academics (userId, ${keys.join(', ')})
    VALUES (?, ${placeholders})
    ON DUPLICATE KEY UPDATE ${keys.map((key) => `${key} = VALUES(${key})`).join(', ')}
  `;
  try {
    await db.query(sql, values);
    res.status(200).json({ message: 'Education updated', success: true });
  } catch (err) {
    next(err);
  }
});

users.route('/education').delete(authenticate, async (req, res, next) => {
  const db = await getDb();
  const { user, query: { id } } = req;

  const sql = 'DELETE FROM academics WHERE id = ? AND userId = ? AND institute != "National Institute of Technology, Arunachal Pradesh"';
  try {
    const [results] = await db.query(sql, [id, user.id]);
    console.log('Deleted education:', results);
    res.status(200).json({ message: 'Education deleted', success: true });
  } catch (err) {
    next(err);
  }
});

users.route('/education').get(authenticate, async (req, res, next) => {
  const db = await getDb();
  const { user } = req;
  try {
    const [results] = await db.query('SELECT * FROM academics WHERE userId = ?', [user.id]);
    res.status(200).json({ success: true, educationList: results });
  } catch (err) {
    next(err);
  }
});

users.route('/experience').post(authenticate, async (req, res, next) => {
  const db = await getDb();
  const { user, body } = req;

  const keys = experienceKeys.filter((key) => body[key] !== undefined && key !== 'userId');

  const placeholders = keys.map(() => '?').join(', ');
  const values = [user.id, ...keys.map((key) => {
    if (key === 'ctc') return parseFloat(body[key]) || null;
    return body[key];
  })];
  const sql = `
    INSERT INTO experiences (userId, ${keys.join(', ')})
    VALUES (?, ${placeholders})
    ON DUPLICATE KEY UPDATE ${keys.map((key) => `${key} = VALUES(${key})`).join(', ')}
  `;

  try {
    await db.query(sql, values);
    res.status(200).json({ message: 'Experience updated', success: true });
  } catch (err) {
    next(err);
  }
});

users.route('/experience').delete(authenticate, async (req, res, next) => {
  const db = await getDb();
  const { user } = req;
  const { id } = req.query;

  const sql = 'DELETE FROM experiences WHERE id = ? AND userId = ?';
  try {
    await db.query(sql, [id, user.id]);
    res.status(200).json({ message: 'Experience deleted', success: true });
  } catch (err) {
    next(err);
  }
});

users.route('/experience').get(authenticate, async (req, res, next) => {
  const db = await getDb();
  const { user } = req;

  try {
    const [results] = await db.query('SELECT * FROM experiences WHERE userId = ?', [user.id]);
    res.status(200).json({ success: true, experienceList: results });
  } catch (err) {
    next(err);
  }
});

export default users;
