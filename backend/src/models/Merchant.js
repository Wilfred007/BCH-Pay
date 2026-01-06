const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bchAddress: {
        type: String,
        required: true,
    },
    settlementCurrency: {
        type: String,
        enum: ['USDT', 'USDC', 'FIAT'],
        default: 'USDT',
    },
    bankDetails: {
        accountNumber: String,
        bankName: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Merchant', merchantSchema);
