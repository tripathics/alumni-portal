const express = require('express');
const authenticate = require('../middlewares/auth');
const alumni = express.Router();
const db = require('../db/conn').getDb();

alumni.get('/alumni/membership-prefill', authenticate, (req, res, next) => {
  let id = req.user.id;
  db.query(`SELECT users.id, users.email, users.role, 
  profiles.title, profiles.firstName, profiles.lastName, profiles.dob, profiles.registrationNo, profiles.rollNo, profiles.avatar
  FROM users
  LEFT JOIN profiles ON users.id = profiles.userId AND users.id = ?`, [id], (err, results) => {
    if (err) return next(err);

    res.status(200).json({
      success: true,
      data: results.length ? { ...results[0] } : null,
    });
  });
})

module.exports = alumni;