const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://bookwiffidrips_db_user:e20wyiRjJjKFOeVZ@cluster0.wlx1cac.mongodb.net/';
    console.log('Attempting to connect to MongoDB...');

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('ESERVFAIL')) {
      console.error('Tip: This is often a DNS issue. Check your internet connection or try a different DNS provider (like 8.8.8.8).');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
