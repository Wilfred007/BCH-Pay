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

// Start Worker (Initial run)
monitorPayments();

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
