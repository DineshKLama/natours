import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const DB = process.env.DATABASE.replace(
      '<PASSWORD>',
      encodeURIComponent(process.env.DATABASE_PASSWORD),
    );

    // Added await to resolve the promise before proceeding
    const conn = await mongoose.connect(DB);

    console.log(`DB connection successful! Host: ${conn.connection.host}`);
  } catch (err) {
    console.error('Initial DB connection failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;
