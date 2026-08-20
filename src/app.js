import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import morgan from 'morgan';

// Router imports
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import AppError from './utils/appError.js';
import { globalError } from './controllers/errorController.js';

// Construct __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable extended query parsing
app.set('query parser', 'extended');

// ==========================================
// 1. GLOBAL MIDDLEWARES
// ==========================================

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json({ limit: '16kb' }));

// Serve static files (Cleaner path resolution)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Attach request timestamp
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ==========================================
// 2. ROUTE MOUNTING
// ==========================================

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// ==========================================
// 3. UNHANDLED ROUTE FALLBACK (404)
// ==========================================

// Fixed route parameter syntax from '/*splat' to '*'
app.all('/*splat', (req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404,
  );

  next(err);
});

// Global error handling middleware
app.use(globalError);

export default app;
