import dns from 'node:dns/promises';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

// Configure custom DNS servers (resolves ISP-level DNS resolution issues with MongoDB Atlas)
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Load environment variables from .env file
config({
  path: './.env',
  debug: process.env.NODE_ENV === 'development',
  override: true,
});

// ==========================================
//  DATABASE CONNECTION
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
//  SERVER BOOTSTRAP
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `App running on port ${PORT} in ${process.env.NODE_ENV || 'Production'} mode...`,
  );
});
