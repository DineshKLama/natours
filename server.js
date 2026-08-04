import mongoose from 'mongoose';
import { config } from 'dotenv';
import dns from 'node:dns/promises';
import app from './app.js';

dns.setServers(['1.1.1.1', '8.8.8.8']);
config({ path: './.env', debug: true, override: true });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB connection successfull!'));

const PORT = process.env.PORT || 3000;
//Running  Server
app.listen(PORT, () => console.log(`App running on port ${PORT}`));
