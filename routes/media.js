const media = require('express').Router();
const authenticate = require('../middlewares/auth');
const path = require('path');
const fs = require('fs');

media.get('/sign/:filename', authenticate, (req, res) => {
  // send the file if it exists
  const signDir = path.join(__dirname, '..', 'private', 'sign');
  if (fs.existsSync(path.join(signDir, req.params.filename))) {
    res.sendFile(path.join(signDir, req.params.filename));
  } else {
    res.status(404).json({ message: 'File not found' });
  }
})

media.get('/avatars/:filename', (req, res) => {
  // send the file if it exists
  const avatarsDir = path.join(__dirname, '..', 'public', 'avatars');
  if (fs.existsSync(path.join(avatarsDir, req.params.filename))) {
    res.sendFile(path.join(avatarsDir, req.params.filename));
  } else {
    res.status(404).json({ message: 'File not found' });
  }
})

module.exports = media;