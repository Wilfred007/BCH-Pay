const express = require('express');
const router = express.Router();
const invoiceService = require('../services/invoiceService');
const notificationService = require('../services/notificationService');
const Merchant = require('../models/Merchant');

// Create Invoice
router.post('/create', async (req, res) => {
    try {
        const { merchantId, amountFiat, currency, items } = req.body;

        const merchant = await Merchant.findById(merchantId);
        if (!merchant) return res.status(404).json({ message: 'Merchant not found' });

        const invoice = await invoiceService.createInvoice(merchantId, amountFiat, currency, items);

        // Notify merchant
        await notificationService.notifyInvoiceCreated(invoice, merchant.email);

        res.status(201).json(invoice);
    } catch (error) {
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
