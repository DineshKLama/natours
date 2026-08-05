import mongoose from 'mongoose';
import { config } from 'dotenv';
import dns from 'node:dns/promises';
import fs from 'node:fs';
import Tour from '../../models/tourModel.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Globle Variables for ES Module
const __dirname = dirname(fileURLToPath(import.meta.url));

dns.setServers(['1.1.1.1', '8.8.8.8']);
config({ path: './.env', debug: true, override: true });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB connection successfull!'));

// Read JSON File
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Successfully loaded!');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
