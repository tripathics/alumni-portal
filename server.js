const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookies = require('cookie-parser');
const path = require('path');
const dbo = require('./db/conn');

const app = express();

app.use(cookies());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: [`http://localhost:${process.env.PORT}`, 'http://localhost:3000'],
    credentials: true
  }));
}

const initializeStorage = () => {
  const fs = require('fs');
  const avatarsDir = path.join(__dirname, 'public', 'avatars');
  if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
  }
  const signDir = path.join(__dirname, 'private', 'sign');
  if (!fs.existsSync(signDir)) {
    fs.mkdirSync(signDir, { recursive: true });
  }
}

const port = process.env.SERVER_PORT || 5000;
app.listen(port, () => {
  console.log('Server listening to port', port, ' Environment:', process.env.NODE_ENV);
  dbo.connectToServer(() => {
    initializeStorage();

    // middlewares for api routes
    app.use('/api', require('./routes/users'));
    app.use('/api', require('./routes/alumni'));

    // middlewares for media routes
    app.use('/media', require('./routes/media'));

    // middlewares for error handling
    app.use(require('./middlewares/error'));

    // serve react frontend (static files) from build folder in production environment
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, 'client', 'dist')));
      app.use((req, res, next) => {
        res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
      });
    }
  });
});