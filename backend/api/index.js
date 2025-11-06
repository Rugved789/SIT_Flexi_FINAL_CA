import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from "../routes/authRoutes.js";
import campaignRoutes from "../routes/campaignRoutes.js";
import donationRoutes from "../routes/donationRoutes.js";
import { errorHandler, setupErrorLogging } from "../middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Initialize error logging
setupErrorLogging(app);

app.use("/api/campaigns", campaignRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/auth", authRoutes);

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`[${new Date().toISOString()}] MongoDB connected`);
} catch (err) {
  console.error(`[${new Date().toISOString()}] MongoDB connection error:`, err);
  process.exit(1);
}

// Add error handler middleware last
app.use(errorHandler);

// Add 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Not Found',
      status: 404,
      timestamp: new Date().toISOString()
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[${new Date().toISOString()}] Server running on port ${PORT}`));
