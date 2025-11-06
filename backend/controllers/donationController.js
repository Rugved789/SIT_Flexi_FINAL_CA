import Donation from '../models/Donation.js';
import User from '../models/User.js';
import Campaign from '../models/Campaign.js';

// Create a new donation
const createDonation = async (req, res, next) => {
    try {
        const { campaignId, amount, donationType, itemDetails } = req.body;
        const donorId = req.user.id;

        // Validate campaign exists
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({
                error: {
                    message: 'Campaign not found',
                    status: 404,
                    timestamp: new Date().toISOString(),
                    details: [{ message: 'The specified campaign does not exist' }]
                }
            });
        }

        // Create donation
        const donation = await Donation.create({
            donorId,
            campaignId,
            amount,
            donationType,
            itemDetails,
            status: 'received' // Default status
        });

        // If it's a money donation, update campaign's raised amount
        if (donationType === 'money') {
            campaign.raisedAmount = (campaign.raisedAmount || 0) + amount;
            await campaign.save();
        }

        // Populate campaign details
        const populatedDonation = await Donation.findById(donation._id)
            .populate('campaignId', 'title goalAmount')
            .populate('donorId', 'name email');

        res.status(201).json({
            message: "Donation created successfully",
            timestamp: new Date().toISOString(),
            donation: populatedDonation
        });

    } catch (error) {
        next(error);
    }
};

// Get donor's donations
const getMyDonations = async (req, res, next) => {
    try {
        const donations = await Donation.find({ donorId: req.user.id })
            .populate('campaignId', 'title goalAmount imageUrl')
            .sort({ createdAt: -1 });

        res.json({
            timestamp: new Date().toISOString(),
            donations
        });
    } catch (error) {
        next(error);
    }
};

// Get donations for a specific campaign (for NGO view)
const getCampaignDonations = async (req, res, next) => {
    try {
        const donations = await Donation.find({ campaignId: req.params.campaignId })
            .populate('donorId', 'name email')
            .sort({ createdAt: -1 });

        // Calculate statistics
        const totalAmount = donations.reduce((sum, donation) => {
            return donation.donationType === 'money' ? sum + donation.amount : sum;
        }, 0);

        const itemDonations = donations.filter(donation => donation.donationType === 'items');

        res.json({
            timestamp: new Date().toISOString(),
            donations,
            stats: {
                totalAmount,
                totalDonors: new Set(donations.map(d => d.donorId.toString())).size,
                totalItems: itemDonations.length
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update donation status (for NGO)
const updateDonationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const donation = await Donation.findById(req.params.donationId);

        if (!donation) {
            return res.status(404).json({
                error: {
                    message: 'Donation not found',
                    status: 404,
                    timestamp: new Date().toISOString(),
                    details: [{ message: 'The specified donation does not exist' }]
                }
            });
        }

        donation.status = status;
        await donation.save();

        res.json({
            message: "Donation status updated successfully",
            timestamp: new Date().toISOString(),
            donation
        });
    } catch (error) {
        next(error);
    }
};

export {
    createDonation,
    getMyDonations,
    getCampaignDonations,
    updateDonationStatus
};