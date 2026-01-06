const Invoice = require('../models/Invoice');
const bchService = require('./bchService');
const priceService = require('./priceService');

class InvoiceService {
    /**
     * Create a new invoice
     */
    async createInvoice(merchantId, amountFiat, currency = 'USD', items = []) {
        try {
            // 1. Get BCH price and calculate amount
            const { bchAmount, rate } = await priceService.calculateBCHAmount(amountFiat, currency);

            // 2. Generate a unique BCH address for this invoice
            // In a production app, you'd derive this from an xPub
            const { address, WIF } = await bchService.generateAddress();

            // 3. Set expiration (e.g., 15 minutes)
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 15);

            // 4. Save invoice to DB
            const invoice = new Invoice({
                merchantId,
                invoiceAddress: address,
                amountBCH: bchAmount,
                amountFiat,
                currency,
                items,
                status: 'pending',
                encryptedWIF: WIF, // In production, encrypt this!
                priceLock: {
                    rate,
                    expiresAt
                }
            });

            await invoice.save();

            // For this MVP, we'll assume the system can sweep the address later if needed.

            return invoice;
        } catch (error) {
            console.error('Error creating invoice:', error);
            throw error;
        }
    }

    /**
     * Get invoice by ID
     */
    async getInvoiceById(id) {
        return await Invoice.findById(id).populate('merchantId', 'username email');
    }

    /**
     * Update invoice status
     */
    async updateInvoiceStatus(id, status, txHash = null) {
        const update = { status };
        if (txHash) update.txHash = txHash;

        return await Invoice.findByIdAndUpdate(id, update, { new: true });
    }
}

module.exports = new InvoiceService();
