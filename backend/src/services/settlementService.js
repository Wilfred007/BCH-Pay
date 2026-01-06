const Settlement = require('../models/Settlement');
const Invoice = require('../models/Invoice');
const Log = require('../models/Log');
const bchService = require('./bchService');
const axios = require('axios');

class SettlementService {
    /**
     * Trigger settlement for a confirmed invoice
     */
    async settleInvoice(invoiceId) {
        try {
            const invoice = await Invoice.findById(invoiceId);
            if (!invoice || invoice.status !== 'confirmed') {
                throw new Error('Invoice not ready for settlement');
            }

            // 1. Sweep BCH to Exchange Wallet
            const exchangeAddress = process.env.EXCHANGE_BCH_ADDRESS;
            if (!exchangeAddress) throw new Error('EXCHANGE_BCH_ADDRESS not configured');

            console.log(`Sweeping BCH from ${invoice.invoiceAddress} to ${exchangeAddress}...`);
            const sweepTxId = await bchService.sweep(invoice.encryptedWIF, exchangeAddress);

            // 2. Trigger Swap on Binance (Mocked for now)
            const stableAmount = await this.swapOnBinance(invoice.amountBCH);

            const settlement = new Settlement({
                invoiceId: invoice._id,
                merchantId: invoice.merchantId,
                bchAmount: invoice.amountBCH,
                stableAmount: stableAmount,
                currency: 'USDT',
                status: 'completed',
                txHash: sweepTxId,
                completedAt: new Date()
            });

            await settlement.save();

            // Update invoice status
            invoice.status = 'settled';
            await invoice.save();

            // Log the event
            await new Log({
                merchantId: invoice.merchantId,
                invoiceId: invoice._id,
                type: 'settlement',
                details: `Settled ${invoice.amountBCH} BCH for ${stableAmount} USDT. Sweep TX: ${sweepTxId}`
            }).save();

            return settlement;
        } catch (error) {
            console.error('Settlement error:', error);
            await new Log({
                type: 'error',
                details: `Settlement failed for invoice ${invoiceId}: ${error.message}`
            }).save();
            throw error;
        }
    }

    /**
     * Mocked Binance swap logic
     */
    async swapOnBinance(amountBCH) {
        // In a real app, you'd use the Binance API to create a market sell order
        // const binance = new Binance().options({ APIKEY: process.env.BINANCE_API_KEY, APISECRET: process.env.BINANCE_API_SECRET });
        // const result = await binance.marketSell('BCHUSDT', amountBCH);

        console.log(`Simulating Binance swap for ${amountBCH} BCH...`);
        const priceRes = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd');
        const currentPrice = priceRes.data['bitcoin-cash'].usd;

        return parseFloat((amountBCH * currentPrice).toFixed(2));
    }
}

module.exports = new SettlementService();
