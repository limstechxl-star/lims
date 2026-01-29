const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const DemoRequest = require('../models/DemoRequest');
const nodemailer = require('nodemailer');

// Validation middleware
const validateDemoRequest = [
    body('fullName').trim().notEmpty().withMessage('Full name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').trim().isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
    body('phone').optional().trim(),
    body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
    body('organizationName').trim().notEmpty().withMessage('Organization name is required'),
    body('industryType').notEmpty().withMessage('Industry type is required')
        .isIn(['pharmaceutical', 'biotechnology', 'clinical', 'academic', 'chemical', 'food', 'environmental', 'other'])
        .withMessage('Invalid industry type'),
    body('organizationSize').notEmpty().withMessage('Organization size is required')
        .isIn(['1-10', '11-50', '51-200', '201-500', '500+'])
        .withMessage('Invalid organization size'),
    body('country').trim().notEmpty().withMessage('Country is required'),
    body('interestedProducts').isArray({ min: 1 }).withMessage('Please select at least one product'),
    body('preferredDate').optional().isISO8601().withMessage('Invalid date format'),
    body('preferredTime').optional().isIn(['morning', 'afternoon', 'evening', '']),
    body('comments').optional().trim().isLength({ max: 500 }).withMessage('Comments cannot exceed 500 characters')
];

// Email transporter configuration (optional - only if email credentials are provided)
let transporter = null;
if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

// POST /api/demo/request - Submit demo request
router.post('/request', validateDemoRequest, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        // Create demo request
        const demoRequest = new DemoRequest({
            ...req.body,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent')
        });

        await demoRequest.save();

        console.log('✅ New demo request received:', {
            name: demoRequest.fullName,
            email: demoRequest.email,
            organization: demoRequest.organizationName
        });

        // Send email notification (if configured)
        if (transporter) {
            try {
                // Email to admin
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: process.env.ADMIN_EMAIL || 'sales@thelabax.com',
                    subject: `New Demo Request from ${demoRequest.fullName}`,
                    html: `
                        <h2>New Demo Request Received</h2>
                        <h3>Personal Information</h3>
                        <ul>
                            <li><strong>Name:</strong> ${demoRequest.fullName}</li>
                            <li><strong>Email:</strong> ${demoRequest.email}</li>
                            <li><strong>Phone:</strong> ${demoRequest.phone || 'Not provided'}</li>
                            <li><strong>Job Title:</strong> ${demoRequest.jobTitle}</li>
                        </ul>
                        <h3>Organization Details</h3>
                        <ul>
                            <li><strong>Organization:</strong> ${demoRequest.organizationName}</li>
                            <li><strong>Industry:</strong> ${demoRequest.industryType}</li>
                            <li><strong>Size:</strong> ${demoRequest.organizationSize}</li>
                            <li><strong>Country:</strong> ${demoRequest.country}</li>
                        </ul>
                        <h3>Demo Preferences</h3>
                        <ul>
                            <li><strong>Interested Products:</strong> ${demoRequest.interestedProducts.join(', ')}</li>
                            <li><strong>Preferred Date:</strong> ${demoRequest.preferredDate ? new Date(demoRequest.preferredDate).toLocaleDateString() : 'Not specified'}</li>
                            <li><strong>Preferred Time:</strong> ${demoRequest.preferredTime || 'Not specified'}</li>
                            <li><strong>Comments:</strong> ${demoRequest.comments || 'None'}</li>
                        </ul>
                        <p><em>Submitted at: ${new Date(demoRequest.submittedAt).toLocaleString()}</em></p>
                    `
                });

                // Confirmation email to user
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: demoRequest.email,
                    subject: 'Thank You for Your Interest in LabAx',
                    html: `
                        <h2>Thank You for Requesting a Demo!</h2>
                        <p>Dear ${demoRequest.fullName},</p>
                        <p>We have received your demo request for LabAx. Our team will review your information and contact you within 24 hours to schedule a personalized demonstration.</p>
                        <h3>Your Request Details:</h3>
                        <ul>
                            <li><strong>Organization:</strong> ${demoRequest.organizationName}</li>
                            <li><strong>Interested Products:</strong> ${demoRequest.interestedProducts.join(', ')}</li>
                        </ul>
                        <p>In the meantime, feel free to explore our website or contact us at <a href="mailto:sales@thelabax.com">sales@thelabax.com</a> if you have any questions.</p>
                        <p>Best regards,<br>The LabAx Team</p>
                    `
                });

                console.log('📧 Email notifications sent successfully');
            } catch (emailError) {
                console.error('⚠️  Email sending failed:', emailError.message);
                // Don't fail the request if email fails
            }
        }

        res.status(201).json({
            success: true,
            message: 'Demo request submitted successfully',
            data: {
                id: demoRequest._id,
                submittedAt: demoRequest.submittedAt
            }
        });

    } catch (error) {
        console.error('❌ Error processing demo request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit demo request. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/demo/requests - Get all demo requests (admin only - add auth later)
router.get('/requests', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const requests = await DemoRequest.find()
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await DemoRequest.countDocuments();

        res.json({
            success: true,
            data: requests,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('❌ Error fetching demo requests:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch demo requests'
        });
    }
});

// GET /api/demo/requests/:id - Get single demo request
router.get('/requests/:id', async (req, res) => {
    try {
        const request = await DemoRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Demo request not found'
            });
        }

        res.json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error('❌ Error fetching demo request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch demo request'
        });
    }
});

// PATCH /api/demo/requests/:id/status - Update request status
router.patch('/requests/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'contacted', 'scheduled', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const request = await DemoRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Demo request not found'
            });
        }

        res.json({
            success: true,
            message: 'Status updated successfully',
            data: request
        });
    } catch (error) {
        console.error('❌ Error updating status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update status'
        });
    }
});

module.exports = router;
