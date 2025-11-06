import express from "express";
import Campaign from "../models/Campaign.js";
import { protect } from "../middleware/authMiddleware.js";
import verifyRole from "../middleware/verifyRole.js";
import {
  campaignValidation,
  campaignUpdateValidation,
  idParamValidation,
} from "../middleware/validators.js";

const router = express.Router();

/* ===========================================================
   🧩 1️⃣ Create a new Campaign  (NGO Only)
   =========================================================== */
router.post(
  "/create",
  protect,
  verifyRole(["ngo"]),
  campaignValidation,
  async (req, res, next) => {
    try {
      console.log("[POST /api/campaigns/create] req.user:", req.user);
      console.log("[POST /api/campaigns/create] req.body:", req.body);

      const newCampaign = new Campaign({
        ...req.body,
        ngo: req.user.id,
        status: "active", // always normalized
      });

      await newCampaign.save();

      res.status(201).json({
        message: "Campaign created successfully",
        timestamp: new Date().toISOString(),
        campaign: newCampaign,
      });
    } catch (err) {
      next(err);
    }
  }
);

/* ===========================================================
   🧩 2️⃣ Fetch all Campaigns (Public)
   =========================================================== */
router.get("/", async (req, res, next) => {
  try {
    const campaigns = await Campaign.find()
      .populate("ngo", "name email")
      .sort({ createdAt: -1 });

    res.json({
      timestamp: new Date().toISOString(),
      campaigns,
    });
  } catch (err) {
    next(err);
  }
});

/* ===========================================================
   🧩 3️⃣ Fetch NGO's own Campaigns (specific route — must be before /:id)
   =========================================================== */
router.get(
  "/my-campaigns",
  protect,
  verifyRole(["ngo"]),
  async (req, res, next) => {
    try {
      console.log("[GET /api/campaigns/my-campaigns] req.user:", req.user);

      const campaigns = await Campaign.find({ ngo: req.user.id }).sort({
        createdAt: -1,
      });

      res.json({
        timestamp: new Date().toISOString(),
        campaigns,
      });
    } catch (err) {
      next(err);
    }
  }
);

/* ===========================================================
   🧩 4️⃣ Fetch Single Campaign by ID (Public)
   =========================================================== */
router.get("/:id", async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "ngo",
      "name email"
    );

    if (!campaign) {
      return res.status(404).json({
        error: {
          message: "Campaign not found",
          status: 404,
          timestamp: new Date().toISOString(),
        },
      });
    }

    res.json({
      timestamp: new Date().toISOString(),
      campaign,
    });
  } catch (err) {
    next(err);
  }
});

/* ===========================================================
   🧩 5️⃣ Update Campaign (NGO Only)
   =========================================================== */
router.put(
  "/:id",
  protect,
  verifyRole(["ngo"]),
  idParamValidation,
  campaignUpdateValidation,
  async (req, res, next) => {
    try {
      const updated = await Campaign.findOneAndUpdate(
        { _id: req.params.id, ngo: req.user.id },
        req.body,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          error: {
            message:
              "Campaign not found or you do not have permission to update it",
            status: 404,
            timestamp: new Date().toISOString(),
          },
        });
      }

      res.json({
        message: "Campaign updated successfully",
        timestamp: new Date().toISOString(),
        campaign: updated,
      });
    } catch (err) {
      next(err);
    }
  }
);

/* ===========================================================
   🧩 6️⃣ Delete Campaign (NGO Only)
   =========================================================== */
router.delete(
  "/:id",
  protect,
  verifyRole(["ngo"]),
  idParamValidation,
  async (req, res, next) => {
    try {
      const deleted = await Campaign.findOneAndDelete({
        _id: req.params.id,
        ngo: req.user.id,
      });

      if (!deleted) {
        return res.status(404).json({
          error: {
            message:
              "Campaign not found or you do not have permission to delete it",
            status: 404,
            timestamp: new Date().toISOString(),
          },
        });
      }

      res.json({
        message: "Campaign deleted successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);
// ✅ Get NGO Dashboard Stats
router.get("/stats/overview", protect, verifyRole(["ngo"]), async (req, res, next) => {
  try {
    // Count total active campaigns for this NGO
    const activeCampaigns = await Campaign.countDocuments({
      ngo: req.user.id,
      status: "active",
    });

    // Calculate total donation amount from all campaigns
    const donations = await Campaign.aggregate([
      { $match: { ngo: req.user._id || req.user.id } },
      {
        $lookup: {
          from: "donations", // name of Donation collection
          localField: "_id",
          foreignField: "campaignId",
          as: "donations",
        },
      },
      { $unwind: { path: "$donations", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          totalDonations: { $sum: "$donations.amount" },
        },
      },
    ]);

    const totalDonations = donations.length > 0 ? donations[0].totalDonations : 0;

    res.json({
      activeCampaigns,
      totalDonations,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[NGO Stats Error]", err);
    next(err);
  }
});

export default router;
