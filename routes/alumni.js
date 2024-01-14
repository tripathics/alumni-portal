const express = require('express');
const authenticate = require('../middlewares/auth');
const { uploadSign } = require('../middlewares/uploadFile');
const alumni = express.Router();
const db = require('../db/conn').getDb();

alumni.get('/alumni/membership-prefill', authenticate, (req, res, next) => {
  let id = req.user.id;

  const sql = `SELECT profiles.title, profiles.firstName, profiles.lastName, profiles.dob, 
    profiles.category, profiles.nationality, profiles.religion, 
    profiles.address, profiles.pincode, profiles.city, profiles.country, 
    profiles.phone, profiles.altPhone, users.email, profiles.altEmail, 
    profiles.registrationNo, profiles.rollNo,
    academics.degree, academics.discipline, academics.endDate, membership_applications.status 
    FROM profiles 
    LEFT JOIN academics ON profiles.userId = academics.userId 
    LEFT JOIN users ON profiles.userId = users.id 
    LEFT JOIN membership_applications ON profiles.userId = membership_applications.userId
    WHERE academics.institute = "National Institute of Technology, Arunachal Pradesh" AND profiles.userId = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) return next(err);

    if (results.length) {
      if (results[0].status === 'pending') {
        return res.status(200).json({
          success: false,
          message: 'Your membership application is already pending for approval',
        });
      } else {
        res.status(200).json({
          success: true,
          data: results[0],
        });
      }
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
  let body = req.body;
  let sign = req.file;

  // check if user has completed profile and academic details for NIT Arunachal Pradesh 
  // and doesn't currently have a pending membership application
  const sql = `SELECT
  profiles.userId, profiles.registrationNo, profiles.rollNo, academics.id,
  membership_applications.status 
  FROM profiles 
  LEFT JOIN academics ON profiles.userId = academics.userId
  LEFT JOIN membership_applications ON profiles.userId = membership_applications.userId
  WHERE academics.institute = "National Institute of Technology, Arunachal Pradesh" 
  AND profiles.userId = ?`

  db.query(sql, [id], (err, results) => {
    if (err) return next(err);

    if (results.length) {
      if (results[0].status === 'pending') {
        return res.status(200).json({
          success: false,
          message: 'Your membership application is already pending for approval',
        });
      }

      // insert into membership applications table from profiles and academics table (for NIT Arunachal Pradesh) WHERE userId = id
      let sql;
      sql = `INSERT INTO membership_applications 
      ( userId, membershipLevel, sign )
      VALUES (?, ?, ?)`

      db.query(sql, [id, body.membershipLevel, sign?.filename], (err, results) => {
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