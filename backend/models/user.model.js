import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number
    },
    password: {
        type: String
    },
    googleId: {
        type: String
    },
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true
    },
    authProvider: {
        type: String,
        enum: ['email', 'google'],
        default: 'email'
    },
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        location: { type: String },
        resume: { type: String }, // URL to resume file
        resumeOriginalName: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: {
            type: String,
            default: ""
        },
        linkedinUrl: { type: String },
        githubUrl: { type: String },
        // Recruiter-specific fields
        designation: { type: String },
        companyName: { type: String },
        companyWebsite: { type: String },
        companyEmail: { type: String },
        companyLocation: { type: String },
        companyDescription: { type: String },
        yearsOfExperience: { type: Number }
    },
    notifications: [{
        message: { type: String },
        type: { type: String, enum: ['application_status', 'general'], default: 'general' },
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
        applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }]
}, { timestamps: true });
export const User = mongoose.model('User', userSchema);