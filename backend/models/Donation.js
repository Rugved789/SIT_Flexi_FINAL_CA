import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    donationType: {
        type: String,
        enum: ['money', 'items'],
        required: true
    },
    itemDetails: {
        type: String,
        required: function() {
            return this.donationType === 'items';
        }
    },
    status: {
        type: String,
        enum: ['pending', 'received', 'distributed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Donation', donationSchema);