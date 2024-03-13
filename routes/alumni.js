import { Router } from 'express';
import authenticate from '../middlewares/auth.js';
import { uploadSign } from '../middlewares/uploadFile.js';
import getDb from '../db/conn_new_new.js';

const alumni = Router();

alumni.get('/alumni/membership-prefill', authenticate, (req, res, next) => {
  const db = getDb();
  const { id } = req.user;

  const sql = `SELECT profiles.title, profiles.firstName, profiles.lastName, profiles.dob, 
    profiles.category, profiles.nationality, profiles.religion, 
    profiles.address, profiles.pincode, profiles.city, profiles.state, profiles.country, 
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
      }
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
});

alumni.post('/alumni/membership', authenticate, uploadSign, async (req, res, next) => {
  const { id } = req.user;
  const { body } = req;
  const sign = req.file;
  const db = getDb();

  // check if user has completed profile and academic details for NIT Arunachal Pradesh
  // and doesn't currently have a pending membership application
  const selectSql = `SELECT
  profiles.userId, profiles.registrationNo, profiles.rollNo, academics.id,
  membership_applications.status 
  FROM profiles 
  LEFT JOIN academics ON profiles.userId = academics.userId
  LEFT JOIN membership_applications ON profiles.userId = membership_applications.userId
  WHERE academics.institute = "National Institute of Technology, Arunachal Pradesh" 
  AND profiles.userId = ?`;

  try {
    const [results] = await db.query(selectSql, [id]);
    if (!results.length) {
      return res.status(200).json({
        success: false,
        message: 'Please complete your profile and add your academic details for NIT Arunachal Pradesh before applying for membership.',
      });
    }
    if (results[0].status === 'pending') {
      return res.status(200).json({
        success: false,
        message: 'Your membership application is already pending for approval',
      });
    }
    const insertSql = `INSERT INTO membership_applications 
      ( userId, membershipLevel, sign )
      VALUES (?, ?, ?)`;

    const [insertResults] = await db.query(insertSql, [id, body.membershipLevel, sign?.filename]);
    console.log(insertResults);
    res.status(200).json({
      success: true,
      message: 'Membership application submitted successfully.',
    });
  } catch (err) {
    next(err);
  }
});

alumni.get('/alumni/applications', async (req, res, next) => {
  const db = getDb();

  const sql = `SELECT CONCAT(profiles.title, ' ', profiles.firstName, ' ', profiles.lastName) as Name
  FROM profiles WHERE profiles.userId IN (SELECT userId FROM membership_applications WHERE status = 'pending')`;

  try {
    const [results] = await db.query(sql);
    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (err) {
    next(err);
  }
});

export default alumni;
