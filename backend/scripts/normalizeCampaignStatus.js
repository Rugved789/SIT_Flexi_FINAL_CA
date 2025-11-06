import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Campaign from '../models/Campaign.js';

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MONGO_URI not set in environment. Aborting.');
  process.exit(1);
}

const normalize = async () => {
  try {
    await mongoose.connect(uri, { dbName: process.env.MONGO_DB_NAME });
    console.log('Connected to MongoDB');

    // Find campaigns with status not lowercase
    const campaigns = await Campaign.find({});
    let updated = 0;

    for (const c of campaigns) {
      if (c.status && c.status !== c.status.toLowerCase()) {
        const old = c.status;
        c.status = c.status.toLowerCase();
        await c.save();
        console.log(`Updated campaign ${c._id}: status '${old}' -> '${c.status}'`);
        updated++;
      }
    }

    console.log(`Normalization complete. Updated ${updated} campaigns.`);
    process.exit(0);
  } catch (err) {
    console.error('Normalization failed:', err);
    process.exit(1);
  }
};

normalize();
