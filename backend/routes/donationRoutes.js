import express from 'express';
import { protect, isDonor, isNGO } from '../middleware/authMiddleware.js';
import {
    createDonation,
    getMyDonations,
    getCampaignDonations,
    updateDonationStatus
} from '../controllers/donationController.js';
import {
    donationCreateValidation,
    donationStatusUpdateValidation,
    campaignIdParamValidation
} from '../middleware/donationValidators.js';

const router = express.Router();

// Donor routes
router.post('/create', protect, isDonor, donationCreateValidation, createDonation);
router.get('/my-donations', protect, isDonor, getMyDonations);

// NGO routes
router.get('/campaign/:campaignId', protect, isNGO, campaignIdParamValidation, getCampaignDonations);
router.patch('/:donationId/status', protect, isNGO, donationStatusUpdateValidation, updateDonationStatus);

export default router;