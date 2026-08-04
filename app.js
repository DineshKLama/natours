import express from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Globle Variables for ES Module
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// Middleware to parse incoming JSON request bodies

app.use(morgan('dev'));

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requstedTime = new Date().toISOString();

  next();
});

////////////////////////////////////////////////////////
// API ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export default app;
