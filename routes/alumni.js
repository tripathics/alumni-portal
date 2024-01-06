const express = require('express');
const alumni = express.Router();
const getDb = require('../db/conn').getDb;
const multer = require('multer');
const { findUserByToken } = require('../helpers/helper');

// configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'media/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// configure multer
const upload = multer({ storage: storage });

// updated route
alumni.route('/alumni/register').post(upload.fields([
  { name: 'sign', maxCount: 1 },
  { name: 'passport', maxCount: 1 }
]), (req, res) => {
  // get the file url from req.files object and insert it in the database
  const sign = req.files.sign ? req.files.sign[0].path.slice(6) : null;
  const passport = req.files.passport ? req.files.passport[0].path.slice(6) : null;

  let formFields = [
    'nationality',
    'category',
    'religion',
    'linkedin',
    'github',
    'address',
    'pincode',
    'state',
    'city',
    'country',
    'altPhone',
    'dob',
    'altEmail',
    'courseCompleted',
    'registrationNo',
    'rollNo',
    'discipline',
    'gradYear',
    'currentStatus'
  ]

  // an object containing both req.body and file paths
  let formData = Object.keys(req.body).reduce((obj, key) => {
    obj[key] = req.body[key];
    return obj;
  }, {})

  if (sign) {
    formFields.push('sign');
    formData.sign = sign;
  }
  if (passport) {
    formFields.push('passport');
    formData.passport = passport;
  }

  const token = req.cookies.auth;
  findUserByToken(token).then(results => {
    if (results.length === 0) return res.status(400).json('Invalid jwt');
    const user_id = results[0].id;

    const db = getDb();

    // insert into alumnilist table
    // check for any pending application
    db.query('SELECT * FROM alumnilist WHERE user_id = ? AND isApproved = ?', [user_id, '0'], (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        // update
        let q = '', v = [];
        formFields.forEach((field, index) => {
          if (index === formFields.length - 1) {
            q += field + ' = ?'
          } else {
            q += field + ' = ?,'
          }
          v.push(formData[field])
        })

        db.query('UPDATE alumnilist SET ' + q + ' WHERE user_id = ? AND isApproved = ?', [...v, user_id, '0'], (err, result) => {
          if (err) throw err;
          console.log('Updated form data');
          res.status(200).json({
            success: true,
            message: 'Form submitted successfully'
          })
        })
      } else {
        // insert
        formFields.push('id');
        formFields.push('user_id');
        const id = user_id + '-' + Date.now();

        formData = { ...formData, id: id, user_id };

        let q = '', v = [];
        formFields.forEach((field, index) => {
          if (index === formFields.length - 1) {
            q += field
          } else {
            q += field + ','
          }
          v.push(formData[field])
        })
        const queryPlaceholders = formFields.map(() => '?').join(',');

        db.query('INSERT INTO alumnilist (' + q + ') VALUES (' + queryPlaceholders + ')', [...v], (err, result) => {
          if (err) throw err;
          console.log('Updated form data');
          res.status(200).json({
            success: true,
            message: 'Form submitted successfully'
          })
        })
      }
    });
  }).catch(err => {
    res.clearCookie('auth').status(401).json({ message: 'Unauthorized', error: true });
  })
});

alumni.route('/alumni/prepopulate').post((req, res) => {
  const token = req.cookies.auth;
  findUserByToken(token).then(results => {
    if (results.length === 0) return res.status(400).json('Invalid jwt');
    const user_id = results[0].id;

    const db = getDb();
    db.query('SELECT * FROM alumnilist WHERE userId=?', [user_id], (err, result) => {
      if (err) throw err;
      res.json({
        success: true,
        data: result[0] || null
      });
    })
  }).catch(err => {
    res.clearCookie('auth').status(401).json({ message: 'Unauthorized', error: true });
  })
});

// reject ids from pending table
alumni.route('/alumni/reject').post((req, res) => {
  const db = getDb();
  const { ids } = req.body;
  // const q = `DELETE FROM pending WHERE id IN (?)`;
  const q = `UPDATE alumnilist  SET isApproved ='-1' WHERE id IN (?)`;
  db.query(q, [ids], (err, result) => {
    if (err) throw err;
    console.log('reject by admin');
    res.status(200).json({
      success: true,
      message: 'Deleted rows from pending'
    })
  })
});

// move multiple rows from one table to another
alumni.route('/alumni/accept').post((req, res) => {
  const db = getDb();
  const { ids } = req.body;
  // move from pending to alumnilist
  // const q = `INSERT INTO alumnilist SELECT * FROM alumnilist WHERE id IN (?)`;
  const q = `UPDATE alumnilist  SET isApproved ='1' WHERE id IN (?)`;

  db.query(q, [ids], (err, result) => {
    if (err) throw err;
    console.log('Approve the status of application');
    // delete from pending
    res.status(200).json({
      success: true,
      message: 'Moved rows from pending to alumnilist'
    })
  })
});
alumni.route('/alumni').get((req, res) => {

  const db = getDb();
  db.query('SELECT * FROM alumnilist JOIN profile ON alumnilist.user_id = profile.profile_Id;', (err, result) => {
    if (err) throw err;

    res.json(result)
  })


})

module.exports = alumni;