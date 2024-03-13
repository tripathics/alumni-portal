// upload file using multer
import multer, { diskStorage } from 'multer';
import { join, extname as _extname } from 'path';

// configure multer for different file types and storage
const storage = diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === 'avatar') {
      cb(null, join(__dirname, '..', 'public', 'avatars'));
    } else if (file.fieldname === 'sign') {
      cb(null, join(__dirname, '..', 'private', 'sign'));
    } else {
      cb('Error: Invalid fieldname!');
    }
  },
  filename(req, file, cb) {
    const now = new Date();
    const userId = req.user.id; // Assuming you have the user ID available in the request object
    const extname = _extname(file.originalname).toLowerCase();
    cb(null, userId + now.getTime() + extname);
  },
  fileFilter(req, file, cb) {
    const filetypes = /png|jpg|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(_extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: Only .png, .jpg, and .webp files are allowed!');
  },
});

// create upload middleware for avatar upload
const uploadAvatar = multer({
  storage,
  limits: { fileSize: 200 * 200 * 5 },
}).single('avatar');

// create upload middleware for signature upload
const uploadSign = multer({
  storage,
  limits: { fileSize: 200 * 200 * 5 },
}).single('sign');

// export upload middleware
export { uploadAvatar, uploadSign };
