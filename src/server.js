import { config } from 'dotenv';
import dns from 'node:dns/promises';

// 1. Uncaught Exceptions must be handled immediately before any app code runs
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// 2. Load environment variables before importing modules that depend on process.env
config({
  path: './.env',
  debug: true,
  override: true,
  quiet: true,
});

// Validate required environment variables before proceeding
if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
  console.error(
    'DATABASE or DATABASE_PASSWORD environment variables are missing!',
  );
  process.exit(1);
}

// 3. Configure custom DNS servers (ISP workaround for Atlas)
dns.setServers(['1.1.1.1', '8.8.8.8']);

// 4. Import app and database helper after config is set
import app from './app.js';
import connectDB from './db/db.js';

// 5. Bootstrap Server & Database connection

await connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `App running on port ${PORT} in ${process.env.NODE_ENV || 'Production'} mode...`,
  );
});

// 6. Graceful shutdown on Unhandled Rejections
process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
});
