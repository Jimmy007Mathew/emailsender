// models/Child.js
const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    },
    actualDate: { type: Date }, // Date when the vaccine was taken
    verified: {
        type: Boolean,
        default: false
    },
    verifiedBy: { type: String }, // Added for hospital verification
    vaccineOTP: { type: String }, // OTP for verification
    otpExpires: { type: Date } // OTP expiration time
});

const childSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true }, // Changed from age to DOB
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    vaccinations: [vaccinationSchema],
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parentEmail: { type: String, required: true } // Added for easy querying
}, { timestamps: true });

module.exports = mongoose.model('Child', childSchema);