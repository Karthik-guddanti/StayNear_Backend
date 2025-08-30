import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './src/config/db';
import Hostel from './src/models/Hostel';
import { hostels } from './src/data/hostels'; // 👈 CORRECTED: Add 'src' to the path

dotenv.config();

const importData = async () => {
  try {
    await connectDB();
    await Hostel.deleteMany(); // Clear existing data
    await Hostel.insertMany(hostels);

    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data import: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Hostel.deleteMany();

    console.log('✅ Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data destruction: ${error}`);
    process.exit(1);
  }
};

// Check for a '-d' flag in the command to decide which function to run
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}