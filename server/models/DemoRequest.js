const mongoose = require('mongoose');

const demoRequestSchema = new mongoose.Schema({
    // Personal Information
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    phone: {
        type: String,
        trim: true
    },
    jobTitle: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },

    // Organization Details
    organizationName: {
        type: String,
        required: [true, 'Organization name is required'],
        trim: true
    },
    industryType: {
        type: String,
        required: [true, 'Industry type is required'],
        enum: ['pharmaceutical', 'biotechnology', 'clinical', 'academic', 'chemical', 'food', 'environmental', 'other']
    },
    organizationSize: {
        type: String,
        required: [true, 'Organization size is required'],
        enum: ['1-10', '11-50', '51-200', '201-500', '500+']
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true
    },

    // Demo Preferences
    interestedProducts: {
        type: [String],
        required: [true, 'Please select at least one product'],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'Please select at least one product'
        }
    },
    preferredDate: {
        type: Date
    },
    preferredTime: {
        type: String,
        enum: ['morning', 'afternoon', 'evening', '']
    },
    comments: {
        type: String,
        trim: true,
        maxlength: [500, 'Comments cannot exceed 500 characters']
    },

    // Metadata
    submittedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'scheduled', 'completed', 'cancelled'],
        default: 'pending'
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    }
}, {
    timestamps: true
});

// Indexes for better query performance
demoRequestSchema.index({ email: 1 });
demoRequestSchema.index({ submittedAt: -1 });
demoRequestSchema.index({ status: 1 });

// Virtual for formatted submission date
demoRequestSchema.virtual('formattedDate').get(function () {
    return this.submittedAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Method to get summary
demoRequestSchema.methods.getSummary = function () {
    return {
        id: this._id,
        name: this.fullName,
        email: this.email,
        organization: this.organizationName,
        products: this.interestedProducts.join(', '),
        status: this.status,
        submittedAt: this.formattedDate
    };
};

const DemoRequest = mongoose.model('DemoRequest', demoRequestSchema);

module.exports = DemoRequest;
