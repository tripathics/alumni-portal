const express = require('express');
const authenticate = require('../middlewares/auth');
const { uploadSign } = require('../middlewares/uploadFile');
const alumni = express.Router();
const db = require('../db/conn').getDb();

alumni.get('/alumni/membership-prefill', authenticate, (req, res, next) => {
  let id = req.user.id;

  const sql = `SELECT profiles.userId, profiles.firstName, profiles.lastName, profiles.dob, profiles.registrationNo, profiles.rollNo, academics.id
  FROM profiles LEFT JOIN academics ON profiles.userId = academics.userId AND profiles.userId = ?
  WHERE academics.institute = "National Institute of Technology, Arunachal Pradesh"`

  db.query(sql, [id], (err, results) => {
    if (err) return next(err);

    if (results.length) {
      res.status(200).json({
        success: true,
        data: results[0],
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'Please complete your profile and add your academic details for NIT Arunachal Pradesh before applying for membership.',
      });
    }
  });
})

alumni.post('/alumni/membership', authenticate, uploadSign, (req, res, next) => {
  let id = req.user.id;
  let email = req.user.email;
  let body = req.body;
  let sign = req.file;

  // check if user has completed profile and academic details for NIT Arunachal Pradesh
  const sql = `SELECT profiles.userId, profiles.registrationNo, profiles.rollNo, academics.id 
  FROM profiles LEFT JOIN academics ON profiles.userId = academics.userId AND profiles.userId = ?
  WHERE academics.institute = "National Institute of Technology, Arunachal Pradesh"`

  db.query(sql, [id], (err, results) => {
    if (err) return next(err);

    if (results.length) {
      // insert into membership applications table from profiles and academics table (for NIT Arunachal Pradesh) WHERE userId = id
      const sql = `INSERT INTO membership_applications (userId, title, firstName, lastName, dob, registrationNo, rollNo, mobile, email, membershipType, sign) 
      SELECT profiles.userId, profiles.title, profiles.firstName, profiles.lastName, profiles.dob, profiles.registrationNo, profiles.rollNo, profiles.mobile, ?, ?, ?`

      db.query(sql, [email, body.membershipType, sign?.filename], (err, results) => {
        if (err) return next(err);

        console.log(results);
        res.status(200).json({
          success: true,
          message: 'Membership application submitted successfully.',
        });
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'Please complete your profile and add your academic details for NIT Arunachal Pradesh before applying for membership.',
      });
    }
  });
});

module.exports = alumni;