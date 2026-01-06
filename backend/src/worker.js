const cron = require('node-cron');
const Invoice = require('./models/Invoice');
const bchService = require('./services/bchService');
const settlementService = require('./services/settlementService');
const notificationService = require('./services/notificationService');
const Merchant = require('./models/Merchant');

/**
 * Poll pending invoices for payments
 */
const monitorPayments = async () => {
    try {
        const pendingInvoices = await Invoice.find({ status: 'pending' });

        for (const invoice of pendingInvoices) {
            // Check if expired
            if (new Date() > invoice.priceLock.expiresAt) {
                invoice.status = 'expired';
                await invoice.save();
                console.log(`Invoice ${invoice._id} expired.`);
                continue;
            }

            // Check for transactions on the address
            const transactions = await bchService.getTransactions(invoice.invoiceAddress);

            if (transactions && transactions.length > 0) {
                // For MVP, we assume any transaction to this address is the payment
                // In production, you'd check the amount and confirmations
                const tx = transactions[0];

                console.log(`Payment detected for invoice ${invoice._id}: ${tx.tx_hash}`);

                invoice.status = 'confirmed';
                invoice.txHash = tx.tx_hash;
                await invoice.save();

                // Notify merchant
                const merchant = await Merchant.findById(invoice.merchantId);
                await notificationService.notifyPaymentReceived(invoice, merchant.email);

                // Trigger settlement
                await settlementService.settleInvoice(invoice._id);
                await notificationService.notifySettlementCompleted({ stableAmount: invoice.amountFiat, currency: 'USDT' }, merchant.email);
            }
        }
    } catch (error) {
        console.error('Error in monitorPayments worker:', error);
    }
};

// Run every minute
cron.schedule('* * * * *', () => {
    console.log('Running payment monitor...');
    monitorPayments();
});

module.exports = { monitorPayments };
