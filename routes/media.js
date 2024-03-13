import { Router } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import authenticate from '../middlewares/auth.js';

const media = Router();

media.get('/sign/:filename', authenticate, (req, res) => {
  // send the file if it exists
  const signDir = join(__dirname, '..', 'private', 'sign');
  if (existsSync(join(signDir, req.params.filename))) {
    res.sendFile(join(signDir, req.params.filename));
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

media.get('/avatars/:filename', (req, res) => {
  // send the file if it exists
  const avatarsDir = join(__dirname, '..', 'public', 'avatars');
  if (existsSync(join(avatarsDir, req.params.filename))) {
    res.sendFile(join(avatarsDir, req.params.filename));
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

export default media;
