import { createRequire } from 'module';
import { createServer } from 'http';
import app from './config/express.config.js';
import connectDb from './db/conn_new_new.js';
import initializeStorage from './utility/fs.utility.js';

const require = createRequire(import.meta.url);
require('dotenv').config();

const server = createServer(app);

const port = process.env.PORT;

const connect = async () => {
  try {
    await connectDb();
    initializeStorage();

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error(`Failed to connect to the database: ${error}`);
  }
};

connect();
