import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import morgan from 'morgan';

// Router imports
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';

// Construct __dirname for ES Modules (Node.js ESM workaround)

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Enable extended query parsing (place this near top of app.js)
app.set('query parser', 'extended');

// ==========================================
// 1. GLOBAL MIDDLEWARES
// ==========================================

// HTTP request logger (enabled for development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser: Reads data from body into req.body (limit to prevent overload)
app.use(express.json({ limit: '10kb' }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Custom middleware: Attach request timestamp to the request object
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

app.all('/*splat', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });

  next();
});

export default app;
