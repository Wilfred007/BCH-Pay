const express = require('express');
const router = express.Router();
const invoiceService = require('../services/invoiceService');
const notificationService = require('../services/notificationService');
const Merchant = require('../models/Merchant');

// Create Invoice
router.post('/create', async (req, res) => {
    try {
        const { merchantId, amountFiat, currency, items } = req.body;
        console.log('Creating invoice for merchant:', merchantId, 'Amount:', amountFiat);

        // Validate merchantId format
        if (!merchantId || !merchantId.match(/^[0-9a-fA-F]{24}$/)) {
            console.error('Invalid merchantId format:', merchantId);
            return res.status(400).json({ message: 'Invalid merchantId format' });
        }

        const merchant = await Merchant.findById(merchantId);
        if (!merchant) {
            console.error('Merchant not found:', merchantId);
            return res.status(404).json({ message: 'Merchant not found' });
        }

        console.log('Merchant found, calling invoiceService.createInvoice...');
        const invoice = await invoiceService.createInvoice(merchantId, amountFiat, currency, items);

        console.log('Invoice created successfully:', invoice._id);
        // Notify merchant
        try {
            await notificationService.notifyInvoiceCreated(invoice, merchant.email);
        } catch (notifyError) {
            console.error('Error sending notification (non-fatal):', notifyError.message);
        }

        res.status(201).json(invoice);
    } catch (error) {
        console.error('Error in /api/invoice/create:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get Invoice Details
router.get('/:id', async (req, res) => {
    try {
        const invoice = await invoiceService.getInvoiceById(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Invoice Status
router.get('/:id/status', async (req, res) => {
    try {
        const invoice = await invoiceService.getInvoiceById(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json({ status: invoice.status, txHash: invoice.txHash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Manual Confirm (for testing/admin)
router.post('/:id/confirm', async (req, res) => {
    try {
        const { txHash } = req.body;
        const invoice = await invoiceService.updateInvoiceStatus(req.params.id, 'confirmed', txHash);
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
