import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    goalAmount: {
      type: Number,
      required: true,
    },
    raisedAmount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: ["Food", "Education", "Health", "Environment", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["active", "completed", "pending"],
      default: "active",
      set: (val) => val.toLowerCase(), // ✅ auto-convert to lowercase
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Campaign", campaignSchema);
