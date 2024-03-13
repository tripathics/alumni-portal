import express, { json } from 'express';
import cors from 'cors';
import cookies from 'cookie-parser';
import routes from '../routes/index.route.js';
import mediaRoutes from '../routes/media.js';
import errorMiddleware from '../middlewares/error.js';

const app = express();

// allow CORS during development
if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: [`http://localhost:${process.env.PORT}`, 'http://localhost:5173'],
    credentials: true,
  }));
}

app.use(cookies());
app.use(json());

// api routes for apis and media
app.use('/api', routes);
app.use('/media', mediaRoutes);

// error handling middleware
app.use(errorMiddleware);

// static files
app.use(express.static('/public'));

export default app;
