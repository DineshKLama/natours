import express from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

app.use(morgan('dev'));

app.use((req, res, next) => {
  req.requstedTime = new Date().toISOString();

  next();
});

////////////////////////////////////////////////////////
// API ROUTES

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

// Start the server
app.listen(PORT, () => console.log(`App running on port ${PORT}`));
