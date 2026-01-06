const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant',
    },
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
    },
    type: {
        type: String,
        enum: ['payment', 'settlement', 'refund', 'info', 'error'],
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Log', logSchema);
