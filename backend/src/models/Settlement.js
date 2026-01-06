const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema({
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        required: true,
    },
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant',
        required: true,
    },
    bchAmount: {
        type: Number,
        required: true,
    },
    stableAmount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'USDT',
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    txHash: {
        type: String,
    },
    completedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Settlement', settlementSchema);
