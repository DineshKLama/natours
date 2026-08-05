import dns from 'node:dns/promises';
import { config } from 'dotenv';
import mongoose from 'mongoose';

// ==========================================
// 1. PROCESS & ENVIRONMENT INITIALIZATION
// ==========================================

// Handle synchronous global exceptions (e.g., referencing undefined variables)
// Must be declared BEFORE any other code executes to catch early runtime errors
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down server...');
  console.error(`${err.name}: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

// Configure custom DNS servers (resolves ISP-level DNS resolution issues with MongoDB Atlas)
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Load environment variables from .env file
config({
  path: './.env',
  debug: process.env.NODE_ENV === 'development',
  override: true,
});

// Deferred import of app to ensure environment variables load first
const { default: app } = await import('./app.js');

// ==========================================
// 2. DATABASE CONNECTION
// ==========================================

// Construct MongoDB connection URI by populating the password placeholder
if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
  console.error(
    'DATABASE or DATABASE_PASSWORD environment variables are missing!',
  );
  process.exit(1);
}

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  encodeURIComponent(process.env.DATABASE_PASSWORD),
);

// Connect to MongoDB database
mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch((err) => {
    console.error('Initial DB connection failed:', err.message);
    process.exit(1);
  });

// ==========================================
// 3. SERVER BOOTSTRAP
// ==========================================

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(
    `App running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode...`,
  );
});

// ==========================================
// 4. PROCESS SAFETY NETS & SHUTDOWN HANDLERS
// ==========================================

// Handle unhandled promise rejections (e.g., asynchronous network/DB connection drops)
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down server...');
  console.error(`${err.name}: ${err.message}`);

  // Gracefully close server before terminating process
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown on termination signals (e.g., Heroku/Docker/SIGTERM)
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully...');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
