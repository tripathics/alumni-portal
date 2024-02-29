const express = require('express');
const users = express.Router();
const bcrypt = require('bcrypt');
const SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const authenticate = require('../../middlewares/auth');
const clearSession = require('../../middlewares/clearSession');
const { uploadAvatar } = require('../../middlewares/uploadFile');
const expiresInMin = 60;

const { profiles: profileKeys, academics: academicKeys, experiences: experienceKeys } = require('../../db/schema');
const { genToken } = require('../../utility/token.utility');

// const db = require('../../db/conn').getDb();
const db = require('../../db/conn_new').getDb();

users.route('/users/register-admin').post(async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if ((!email || !password || !confirmPassword) || password !== confirmPassword) {
    return next(Error('Invalid API usage / Passwords do not match'));
  } else {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.query("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [email, hashedPassword, 'admin']);
      console.log('New admin registered: ', result);
      res.status(200).json({
        success: true,
        message: 'User registered'
      });
    } catch (err) {
      next(err);
    }

    // bcrypt.hash(password, 10, (err, hashedPassword) => {
    //   if (err) return next(err);

    //   const insertQuery = "INSERT INTO users (email, password, role) VALUES (?, ?)";
    //   db.query(insertQuery, [email, hashedPassword, 'admin'], (err, result) => {
    //     if (err) return next(err);
    //     console.log('New admin registered: ', result);

    //     res.status(200).json({
    //       success: true,
    //       message: 'User registered'
    //     });
    //   });
    // });
  }
})

users.route('/users/register').post(async (req, res, next) => {
  const { otp, email, password, confirmPassword } = req.body;
  // TODO: verify otp for registration

  if ((!email || !password || !confirmPassword) || password !== confirmPassword) {
    return next('Invalid API usage / Passwords do not match');
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);
    console.log('New user registered: ', result);
    res.status(200).json({
      success: true,
      message: 'User registered'
    });
  } catch (err) {
    next(err);
  }
})

users.route('/users/login').post(clearSession, async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const [result] = await db.query(`SELECT users.*, profiles.title, profiles.firstName, profiles.lastName, profiles.avatar, 
      membership_applications.status = "pending" as profileLocked
      FROM users
      LEFT JOIN profiles ON users.id = profiles.userId
      LEFT JOIN membership_applications ON users.id = membership_applications.userId 
      WHERE users.email = ?`, [email])
    if (result.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials', success: false });
    }
    const [user] = result;
    const isPasswordMatched = await bcrypt.compare(password, user.password); 
    if (!isPasswordMatched) return res.status(400).json({ message: 'Invalid credentials', success: false });
    delete user.password;
    const secret = genToken(user.id);
    if (!secret) throw new Error("Error generating JWT");
    res.cookie('auth', token, { maxAge: expiresInMin * 60 * 1000, httpOnly: true }).json({
      message: 'User logged in', user: user, success: true
    }) 
  } catch (err) {
    next(err);
  }

  // get user details from users table along with their full name and avatar from profiles table
  // db.query(`SELECT users.*, profiles.title, profiles.firstName, profiles.lastName, profiles.avatar, 
  // membership_applications.status = "pending" as profileLocked
  // FROM users
  // LEFT JOIN profiles ON users.id = profiles.userId
  // LEFT JOIN membership_applications ON users.id = membership_applications.userId 
  // WHERE users.email = ?`, [email], (err, results) => {
  //   if (err) return next(err);

  //   if (results.length === 0) {
  //     return res.status(400).json({ message: 'Invalid credentials', success: false });
  //   }
  //   const user = results[0];
  //   bcrypt.compare(password, user.password, (err, isMatch) => {
  //     if (err) return next(err);
  //     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials', success: false });
  //     delete user.password;
  //     console.log(user);
  //     try {
  //       const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: expiresInMin * 60 });
  //       res.cookie('auth', token, { maxAge: expiresInMin * 60 * 1000, httpOnly: true }).json({ message: 'User logged in', user: user, success: true });
  //     } catch (err) {
  //       next(err);
  //     }
  //   });
  // });
});

users.route('/users/auth').get(authenticate, (req, res) => {
  const user = req.user;
  res.status(200).json({ message: 'User authenticated', success: true });
});

users.route('/users/logout').post(authenticate, (req, res) => {
  res.clearCookie('auth').json({ message: 'User logged out', success: true });
});

users.route('/users/profile').get(authenticate, async (req, res, next) => {
  const user = req.user;
  try {
    const [results] = await db.query('SELECT * FROM profiles WHERE userId = ?', [user.id]);
    res.status(200).json({
      success: true,
      personalDetails: results.length ? { ...results[0] } : null,
    });
  } catch (err) {
    next(err);
  }
})

users.route('/users/update-profile').post(authenticate, async (req, res, next) => {
  const user = req.user;
  const body = req.body;

  // don't allow if there is already pending membership application as profile is locked
  try {
    const [membershipApplications] = await db.query(`SELECT * FROM membership_applications WHERE userId = ? AND status = "pending"`, [user.id]);
    if (membershipApplications.length) return res.status(400).json({ message: 'Profile is locked', success: false });

    const keys = profileKeys.filter(key => body[key] !== undefined && key !== 'userId');
    const placeholders = keys.map(() => "?").join(", ");
    const values = [user.id, ...keys.map(key => body[key])];
    const sql = `
      INSERT INTO profiles (userId, ${keys.join(", ")})
      VALUES (?, ${placeholders})
      ON DUPLICATE KEY UPDATE ${keys.map(key => `${key} = VALUES(${key})`).join(", ")}
    `;

    const [results] = await db.query(sql, values);
    console.log(results);
    res.status(200).json({ message: 'Profile updated', success: true });
  } catch (err) {
    next(err);
  }
  // db.query(`SELECT * FROM membership_applications WHERE userId = ? AND status = "pending"`, [user.id], (err, results) => {
  //   if (err) return next(err);
  //   if (results.length) return res.status(400).json({ message: 'Profile is locked', success: false });

  //   const keys = profileKeys.filter(key => body[key] !== undefined && key !== 'userId');

  //   const placeholders = keys.map(() => "?").join(", ");
  //   const values = [user.id, ...keys.map(key => body[key])];
  //   const sql = `
  //     INSERT INTO profiles (userId, ${keys.join(", ")})
  //     VALUES (?, ${placeholders})
  //     ON DUPLICATE KEY UPDATE ${keys.map(key => `${key} = VALUES(${key})`).join(", ")}
  //   `;
  //   db.query(sql, values, (err, results) => {
  //     if (err) return next(err);
  //     console.log(results);
  //     res.status(200).json({ message: 'Profile updated', success: true });
  //   });
  // });
});

users.route('/users/update-avatar').post(authenticate, uploadAvatar, async (req, res, next) => {
  const user = req.user;
  const avatar = req.file;

  try {
    const [results] = await db.query('UPDATE profiles SET avatar = ? WHERE userId = ?', [avatar?.filename, user.id]);
    res.status(200).json({ message: 'Avatar updated', success: true });
  } catch (err) {
    next(err);
  }
  // const sql = 'UPDATE profiles SET avatar = ? WHERE userId = ?';
  // db.query(sql, [avatar?.filename, user.id], (err, results) => {
  //   if (err) return next(err);
  //   console.log(results);
  //   res.status(200).json({ message: 'Avatar updated', success: true });
  // });
});

users.route('/users').get(authenticate, async (req, res, next) => {
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
  // let id = req.user.role === 'admin' ? req.query.id : req.user.id;
  // db.query(`SELECT users.id, users.email, users.role, 
  // profiles.title, profiles.firstName, profiles.lastName, profiles.avatar, 
  // membership_applications.status = "pending" as profileLocked
  // FROM users
  // LEFT JOIN profiles ON users.id = profiles.userId
  // LEFT JOIN membership_applications ON users.id = membership_applications.userId
  // WHERE users.id = ?`, [id], (err, results) => {
  //   if (err) return next(err);

  //   res.status(200).json({
  //     success: true,
  //     user: results.length ? { ...results[0] } : null,
  //   });
  // });
});

users.route('/users/education').post(authenticate, async (req, res, next) => {
  const user = req.user;
  const body = req.body;

  const keys = academicKeys.filter(key => body[key] !== undefined && key !== 'userId');

  const placeholders = keys.map(() => "?").join(", ");
  const values = [user.id, ...keys.map(key => body[key])];
  const sql = `
    INSERT INTO academics (userId, ${keys.join(", ")})
    VALUES (?, ${placeholders})
    ON DUPLICATE KEY UPDATE ${keys.map(key => `${key} = VALUES(${key})`).join(", ")}
  `;
  try {
    const [results] = await db.query(sql, values);
    res.status(200).json({ message: 'Education updated', success: true });
  } catch (err) {
    next(err);
  }
  // db.query(sql, values, (err, results) => {
  //   if (err) return next(err);
  //   console.log('Added education:', results);
  //   res.status(200).json({ message: 'Education updated', success: true });
  // });
});

users.route('/users/education').delete(authenticate, async (req, res, next) => {
  const user = req.user;
  const id = req.query.id;

  const sql = 'DELETE FROM academics WHERE id = ? AND userId = ? AND institute != "National Institute of Technology, Arunachal Pradesh"';
  try {
    const [results] = await db.query(sql, [id, user.id]);
    console.log('Deleted education:', results);
    res.status(200).json({ message: 'Education deleted', success: true });
  } catch (err) {
    next(err);
  }
  // db.query(sql, [id, user.id], (err, results) => {
  //   if (err) return next(err);
  //   console.log('Deleted education:', results);
  //   res.status(200).json({ message: 'Education deleted', success: true });
  // });
});

users.route('/users/education').get(authenticate, async (req, res, next) => {
  const user = req.user;
  try {
    const [results] = await db.query(`SELECT * FROM academics WHERE userId = ?`, [user.id]);
    res.status(200).json({ success: true, educationList: results });
  } catch (err) {
    next(err);
  }
  // const sql = `SELECT * FROM academics WHERE userId = ?`;
  // db.query(sql, [user.id], (err, results) => {
  //   if (err) return next(err);
  //   console.log('Education list', results);
  //   res.status(200).json({ success: true, educationList: results });
  // })
});

users.route('/users/experience').post(authenticate, async (req, res, next) => {
  const user = req.user;
  const body = req.body;

  const keys = experienceKeys.filter(key => body[key] !== undefined && key !== 'userId');

  const placeholders = keys.map(() => "?").join(", ");
  const values = [user.id, ...keys.map(key => {
    if (key === 'ctc') return parseFloat(body[key]) || null;
    return body[key]
  })];
  const sql = `
    INSERT INTO experiences (userId, ${keys.join(", ")})
    VALUES (?, ${placeholders})
    ON DUPLICATE KEY UPDATE ${keys.map(key => `${key} = VALUES(${key})`).join(", ")}
  `;

  try {
    const [results] = await db.query(sql, values);
    res.status(200).json({ message: 'Experience updated', success: true });
  } catch (err) {
    next(err);
  }
  // db.query(sql, values, (err, results) => {
  //   if (err) return next(err);
  //   console.log('Added experience:', results);
  //   res.status(200).json({ message: 'Experience updated', success: true });
  // });
});

users.route('/users/experience').delete(authenticate, async (req, res, next) => {
  const user = req.user;
  const id = req.query.id;

  const sql = 'DELETE FROM experiences WHERE id = ? AND userId = ?';
  try {
    const [results] = await db.query(sql, [id, user.id]);
    res.status(200).json({ message: 'Experience deleted', success: true });
  } catch (err) {
    next(err);
  }
  // db.query(sql, [id, user.id], (err, results) => {
  //   if (err) return next(err);
  //   console.log('Deleted experience:', results);
  //   res.status(200).json({ message: 'Experience deleted', success: true });
  // });
});

users.route('/users/experience').get(authenticate, async (req, res, next) => {
  const user = req.user;

  try {
    const [results] = await db.query(`SELECT * FROM experiences WHERE userId = ?`, [user.id]);
    res.status(200).json({ success: true, experienceList: results });
  } catch (err) {
    next(err);
  }
  // const sql = `SELECT * FROM experiences WHERE userId = ?`;
  // db.query(sql, [user.id], (err, results) => {
  //   if (err) return next(err);
  //   console.log('Experience list', results);
  //   res.status(200).json({ success: true, experienceList: results });
  // })
});

module.exports = users;