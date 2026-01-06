const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant',
        required: true,
    },
    invoiceAddress: {
        type: String,
        required: true,
        unique: true,
    },
    amountBCH: {
        type: Number,
        required: true,
    },
    amountFiat: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'USD',
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'settled', 'expired'],
        default: 'pending',
    },
    txHash: {
        type: String,
    },
    encryptedWIF: {
        type: String,
    },
    priceLock: {
        rate: Number,
        expiresAt: Date,
    },
    items: [{
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 }
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Invoice', invoiceSchema);
