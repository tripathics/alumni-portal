const express = require('express');
const users = express.Router();
const bcrypt = require('bcrypt');
const SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const authenticate = require('../middlewares/auth');
const clearSession = require('../middlewares/clearSession');
const { uploadAvatar } = require('../middlewares/uploadFile');
const expiresInMin = 60;

const { profiles: profileKeys, academics: academicKeys, experiences: experienceKeys } = require('../db/schema');

const db = require('../db/conn').getDb();

users.route('/users/register-admin').post((req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if ((!email || !password || !confirmPassword) || password !== confirmPassword) {
    return next(Error('Invalid API usage / Passwords do not match'));
  } else {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return next(err);

      const insertQuery = "INSERT INTO users (email, password, role) VALUES (?, ?)";
      db.query(insertQuery, [email, hashedPassword, 'admin'], (err, result) => {
        if (err) return next(err);
        console.log('New admin registered: ', result);

        res.status(200).json({
          success: true,
          message: 'User registered'
        });
      });
    });
  }
})

users.route('/users/register').post((req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if ((!email || !password || !confirmPassword) || password !== confirmPassword) {
    return next('Invalid API usage / Passwords do not match');
  } else {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return next(err);

      const insertQuery = "INSERT INTO users (email, password) VALUES (?, ?)";
      db.query(insertQuery, [email, hashedPassword], (err, result) => {
        if (err) return next(err);
        console.log('New user registered: ', result);

        res.status(200).json({
          success: true,
          message: 'User registered'
        });
      });
    });
  }
})

users.route('/users/login').post(clearSession, (req, res, next) => {
  const { email, password } = req.body;

  // get user details from users table along with their full name and avatar from profiles table
  db.query(`SELECT users.*, profiles.title, profiles.firstName, profiles.lastName, profiles.avatar, 
  membership_applications.status = "pending" as profileLocked
  FROM users
  LEFT JOIN profiles ON users.id = profiles.userId
  LEFT JOIN membership_applications ON users.id = membership_applications.userId 
  WHERE users.email = ?`, [email], (err, results) => {
    if (err) return next(err);

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials', success: false });
    }
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return next(err);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials', success: false });
      delete user.password;
      console.log(user);
      try {
        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: expiresInMin * 60 });
        res.cookie('auth', token, { maxAge: expiresInMin * 60 * 1000 }).json({ message: 'User logged in', user: user, success: true });
      } catch (err) {
        next(err);
      }
    });
  });
});

users.route('/users/auth').post(authenticate, (req, res) => {
  const user = req.user;
  res.status(200).json({ message: 'User authenticated', success: true, admin: user.admin });
});

users.route('/users/logout').post(authenticate, (req, res) => {
  res.clearCookie('auth').json({ message: 'User logged out', success: true });
});

users.route('/users/profile').post(authenticate, (req, res, next) => {
  const user = req.user;
  const sql = 'SELECT * FROM profiles WHERE userId = ?';
  db.query(sql, [user.id], (err, results) => {
    if (err) return next(err);
    console.log(results);

    res.status(200).json({
      success: true,
      personalDetails: results.length ? { ...results[0] } : null,
    });
  });
})

users.route('/users/update-profile').post(authenticate, (req, res, next) => {
  const user = req.user;
  const body = req.body;

  // don't allow if there is already pending membership application as profile is locked
  db.query(`SELECT * FROM membership_applications WHERE userId = ? AND status = "pending"`, [user.id], (err, results) => {
    if (err) return next(err);
    if (results.length) return res.status(400).json({ message: 'Profile is locked', success: false });

    const keys = profileKeys.filter(key => body[key] !== undefined && key !== 'userId');

    const placeholders = keys.map(() => "?").join(", ");
    const values = [user.id, ...keys.map(key => body[key])];
    const sql = `
      INSERT INTO profiles (userId, ${keys.join(", ")})
      VALUES (?, ${placeholders})
      ON DUPLICATE KEY UPDATE ${keys.map(key => `${key} = VALUES(${key})`).join(", ")}
    `;
    db.query(sql, values, (err, results) => {
      if (err) return next(err);
      console.log(results);
      res.status(200).json({ message: 'Profile updated', success: true });
    });
  });
});

users.route('/users/update-avatar').post(authenticate, uploadAvatar, (req, res, next) => {
  const user = req.user;
  const avatar = req.file;

  const sql = 'UPDATE profiles SET avatar = ? WHERE userId = ?';
  db.query(sql, [avatar?.filename, user.id], (err, results) => {
    if (err) return next(err);
    console.log(results);
    res.status(200).json({ message: 'Avatar updated', success: true });
  });
});

users.route('/users').get(authenticate, (req, res, next) => {
  let id = req.user.role === 'admin' ? req.query.id : req.user.id;
  db.query(`SELECT users.id, users.email, users.role, 
  profiles.title, profiles.firstName, profiles.lastName, profiles.avatar, 
  membership_applications.status = "pending" as profileLocked
  FROM users
  LEFT JOIN profiles ON users.id = profiles.userId
  LEFT JOIN membership_applications ON users.id = membership_applications.userId
  WHERE users.id = ?`, [id], (err, results) => {
    if (err) return next(err);

    res.status(200).json({
      success: true,
      user: results.length ? { ...results[0] } : null,
    });
  });
});

users.route('/users/education').post(authenticate, (req, res, next) => {
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
  db.query(sql, values, (err, results) => {
    if (err) return next(err);
    console.log('Added education:', results);
    res.status(200).json({ message: 'Education updated', success: true });
  });
});

users.route('/users/education').delete(authenticate, (req, res, next) => {
  const user = req.user;
  const id = req.query.id;

  const sql = 'DELETE FROM academics WHERE id = ? AND userId = ? AND institute != "National Institute of Technology, Arunachal Pradesh"';
  db.query(sql, [id, user.id], (err, results) => {
    if (err) return next(err);
    console.log('Deleted education:', results);
    res.status(200).json({ message: 'Education deleted', success: true });
  });
});

users.route('/users/education').get(authenticate, (req, res, next) => {
  const user = req.user;

  const sql = `SELECT * FROM academics WHERE userId = ?`;
  db.query(sql, [user.id], (err, results) => {
    if (err) return next(err);
    console.log('Education list', results);
    res.status(200).json({ success: true, educationList: results });
  })
});

users.route('/users/experience').post(authenticate, (req, res, next) => {
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
  db.query(sql, values, (err, results) => {
    if (err) return next(err);
    console.log('Added experience:', results);
    res.status(200).json({ message: 'Experience updated', success: true });
  });
});

users.route('/users/experience').delete(authenticate, (req, res, next) => {
  const user = req.user;
  const id = req.query.id;

  const sql = 'DELETE FROM experiences WHERE id = ? AND userId = ?';
  db.query(sql, [id, user.id], (err, results) => {
    if (err) return next(err);
    console.log('Deleted experience:', results);
    res.status(200).json({ message: 'Experience deleted', success: true });
  });
});

users.route('/users/experience').get(authenticate, (req, res, next) => {
  const user = req.user;

  const sql = `SELECT * FROM experiences WHERE userId = ?`;
  db.query(sql, [user.id], (err, results) => {
    if (err) return next(err);
    console.log('Experience list', results);
    res.status(200).json({ success: true, experienceList: results });
  })
});

module.exports = users;