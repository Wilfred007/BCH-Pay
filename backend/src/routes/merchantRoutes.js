const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Merchant = require('../models/Merchant');
const Invoice = require('../models/Invoice');
const Settlement = require('../models/Settlement');
const auth = require('../middleware/auth');

// Register Merchant
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, bchAddress } = req.body;

        let merchant = await Merchant.findOne({ email });
        if (merchant) return res.status(400).json({ message: 'Merchant already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        merchant = new Merchant({
            username,
            email,
            password: hashedPassword,
            bchAddress
        });

        await merchant.save();

        const token = jwt.sign({ id: merchant._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token, merchant: { id: merchant._id, username, email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login Merchant
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const merchant = await Merchant.findOne({ email });
        if (!merchant) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, merchant.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: merchant._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token, merchant: { id: merchant._id, username: merchant.username, email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Merchant Profile
router.get('/:id', auth, async (req, res) => {
    try {
        if (req.merchant.id !== req.params.id) return res.status(403).json({ message: 'Unauthorized' });
        const merchant = await Merchant.findById(req.params.id).select('-password');
        if (!merchant) return res.status(404).json({ message: 'Merchant not found' });
        res.json(merchant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Merchant Invoices
router.get('/:id/invoices', auth, async (req, res) => {
    try {
        if (req.merchant.id !== req.params.id) return res.status(403).json({ message: 'Unauthorized' });
        const invoices = await Invoice.find({ merchantId: req.params.id }).sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Merchant Settlements
router.get('/:id/settlements', auth, async (req, res) => {
    try {
        if (req.merchant.id !== req.params.id) return res.status(403).json({ message: 'Unauthorized' });
        const settlements = await Settlement.find({ merchantId: req.params.id }).sort({ createdAt: -1 });
        res.json(settlements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
