const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const merchantRoutes = require('./routes/merchantRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const { monitorPayments } = require('./worker');

dotenv.config();

// Connect to Database
connectDB();

// Start Worker (Initial run) - Only if not in Vercel
if (process.env.VERCEL !== '1') {
    monitorPayments();
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/merchant', merchantRoutes);
app.use('/api/invoice', invoiceRoutes);

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: err.message || 'Something went wrong on the server',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Vercel Cron Job Endpoint
app.get('/api/cron/monitor', async (req, res) => {
    // Optional: Add secret check to prevent unauthorized calls
    // if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return res.status(401).end('Unauthorized');
    // }

    console.log('Cron job triggered: monitorPayments');
    try {
        await monitorPayments();
        res.status(200).json({ message: 'Monitor payments triggered successfully' });
    } catch (error) {
        console.error('Cron job error:', error);
        res.status(500).json({ error: 'Failed to trigger monitor payments' });
    }
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
