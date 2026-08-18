import { config } from 'dotenv';
import dns from 'node:dns/promises';
import app from './app.js';
import connectDB from './db/db.js';

// Configure custom DNS servers (resolves ISP-level DNS resolution issues with MongoDB Atlas)
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Load environment variables from .env file
config({
  path: './.env',
  debug: true,
  override: true,
  quiet: true,
});

// ==========================================
//  DATABASE CONNECTION
// ==========================================
connectDB();

// Construct MongoDB connection URI by populating the password placeholder
if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
  console.error(
    'DATABASE or DATABASE_PASSWORD environment variables are missing!',
  );
  process.exit(1);
}

// ==========================================
//  SERVER BOOTSTRAP
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `App running on port ${PORT} in ${process.env.NODE_ENV || 'Production'} mode...`,
  );
});
