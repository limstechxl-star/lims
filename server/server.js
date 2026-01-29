require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const demoRoutes = require('./routes/demo');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/demo', demoRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve demo.html for demo route
app.get('/demo', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/demo.html'));
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Catch-all route - serve index.html for any other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 LabAx Server Started Successfully!');
    console.log('='.repeat(50));
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 MongoDB: ${process.env.MONGODB_URI}`);
    console.log('='.repeat(50) + '\n');
    console.log('Available routes:');
    console.log(`  - http://localhost:${PORT}/ (Main website)`);
    console.log(`  - http://localhost:${PORT}/demo (Demo request page)`);
    console.log(`  - http://localhost:${PORT}/api/health (Health check)`);
    console.log(`  - http://localhost:${PORT}/api/demo/request (POST - Submit demo)`);
    console.log(`  - http://localhost:${PORT}/api/demo/requests (GET - View all demos)`);
    console.log('\n' + '='.repeat(50) + '\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    // Close server & exit process
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

module.exports = app;
